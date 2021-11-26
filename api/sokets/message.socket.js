//created by Hatem Ragap
const _ = require("underscore");

const {messageSchemaModel} = require("../models/messagesModel");
const {userSchemaModel} = require("../models/userModel");
const {roomsSchemaModel} = require("../models/conversionsModel");

module.exports = io => {
    // var admin = require("firebase-admin");

    io.of("/api/message").on("connection", socket => {
        console.log('api/message connection');
        socket.on("makeLastMessageAsSeen", async msg => {
            let objectValue = await JSON.parse(msg);
            let chatId = objectValue["chatId"];
            let userId = objectValue["userId"];
            let chat = await roomsSchemaModel.findById(chatId);
            chat.lastMessage.users_see_message.push(userId);
            chat.save();
            io.of("/api/chatRoomList").emit("updateChatRoomList");
        });

        let chatId;
        socket.on("joinChat", async msg => {
            console.log("joinChat", msg);
            let objectValue = await JSON.parse(msg);
            chatId = objectValue["chatId"];
            socket.join(chatId);
        });

        socket.on("getNumberofConnectedUsersToThisRoom", async chatId => {
            var clientsInRoom = io.nsps["/api/message"].adapter.rooms[chatId];
            var numClients =
                clientsInRoom === undefined
                    ? 0
                    : Object.keys(clientsInRoom.sockets).length;

            socket.to(chatId).emit("numberOfConenctedUsers", numClients);
        });

        socket.on("deleteMessage", async id => {
            try {
                await messageSchemaModel.findByIdAndUpdate(id, {isDeleted: 1});
                socket.to(chatId).broadcast.emit("onDeleted", id);

            } catch (err) {
                socket.to(chatId).broadcast.emit("onDeleted", false);
            }
        });

        socket.on("new_message", async msg => {
            let objectValue = JSON.parse(msg);
            let sender_id = objectValue["sender_id"];
            let sender_name = objectValue["sender_name"];
            let messageId = objectValue["messageId"];
            let chat_id = objectValue["chat_id"];
            let message = objectValue["message"];
            let receiver_id = objectValue["receiver_id"];

            let message_type = objectValue["message_type"];
            let imgs = objectValue["imgs"];

            let model = messageSchemaModel({
                _id: messageId,
                message: message,
                sender_id: sender_id,
                receiver_id: receiver_id,
                chat_id: chat_id,
                message_type: message_type,
                imgs: imgs
            });

            model.save(async function (err, data) {
                if (err) {
                    console.log("error is " + err);
                } else {
                    // for new item override this  ,"message_type":"' + message_type + '"
                    let createDate = new Date(data.created * 1000);
                    let send_date = (createDate.getMonth() + 1) + "-" + createDate.getDate();
                    let send_time = createDate.getHours() + ":" + createDate.getMinutes();
                    let w = {
                        _id: data._id,
                        message: message,
                        message_type: message_type,
                        imgs: imgs,
                        isDeleted: data.isDeleted,
                        sender_id: sender_id,
                        receiver_id: receiver_id,
                        send_date: send_date,
                        send_time: send_time,
                        created: data.created,
                        chat_id: chat_id,
                    };
                    socket.to(chat_id).broadcast.emit("msgReceive", w);
                }
            });
            var clientsInRoom = io.nsps["/api/message"].adapter.rooms[chat_id];
            var numClients =
                clientsInRoom === undefined
                    ? 0
                    : Object.keys(clientsInRoom.sockets).length;

            if (numClients === 2) {
                let msgN = {
                    users_see_message: [sender_id, receiver_id],
                    message: message
                };
                await roomsSchemaModel.findByIdAndUpdate(chat_id, {
                    created: Date.now(),
                    lastMessage: msgN
                });
            } else {

                let chat = await roomsSchemaModel.findOne({users: {$all: [receiver_id, sender_id]}});

                let peerUserData = await userSchemaModel.findById(sender_id);

                var payload = {
                    notification: {
                        body: `${message}`,
                        title: `${sender_name} send message`,
                    },
                    data: {
                        "img": `${peerUserData["img"]}`,
                        "name": `${peerUserData["user_name"]}`,
                        "id": `${peerUserData["_id"]}`,
                        "chatId": `${chat['_id']}`,
                        "token": `${peerUserData["token"]}`,
                        "screen": "chat",
                        'click_action': 'FLUTTER_NOTIFICATION_CLICK',
                    },

                };

                // var options = {
                //     priority: "high",
                //     timeToLive: 60 * 60 * 24
                // };
                // admin
                //     .messaging()
                //     .sendToDevice(token, payload, options)
                //     .then(function (ress) {
                //     })
                //     .catch(function (err) {
                //         console.log("error is " + err);
                //     });

                let msgN = {
                    users_see_message: [sender_id],
                    message: message
                };
                await roomsSchemaModel.findByIdAndUpdate(chat_id, {
                    created: Date.now(),
                    lastMessage: msgN
                });
            }

            io.of("/api/chatRoomList").emit("updateChatRoomList");
        });

        socket.on("typing", async msg => {
            let objectValue = JSON.parse(msg);
            let sender_id = objectValue["sender_id"];
            let chat_id = objectValue["chat_id"];
            socket.to(chat_id).broadcast.emit("onTyping", sender_id);
        });

        socket.on("disconnect", () => {
            socket.to(chatId).emit("numberOfConenctedUsers", 1);
        });

        socket.on("leaveChat", async msg => {
            console.log("leaveChat", msg);
            let objectValue = await JSON.parse(msg);
            chatId = null;
            socket.leave(objectValue["chatId"]);
        });
    });
};
