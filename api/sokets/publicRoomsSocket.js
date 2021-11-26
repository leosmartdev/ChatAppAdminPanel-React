//created by Hatem Ragap
const _ = require("underscore");
const { publicChatRoomModel } = require("../models/publicChatRoomModel");
const { userSchemaModel } = require('../models/userModel');

const {
  PublicRoomMessageSchemaModel
} = require("../models/PublicRoomsMessagesModel");

module.exports = io => {
  io.of("/api/joinPublicRoom").on("connection", socket => {

    let roomId;
    socket.on("joinPublicRoom", function(msg) {
      let objectValue = JSON.parse(msg);
        roomId = objectValue["roomId"];
      let user_name = objectValue["user_name"];
      socket.join(roomId);

      var clientsInRoom = io.nsps["/api/joinPublicRoom"].adapter.rooms[roomId];
      var numClients =
        clientsInRoom === undefined
          ? 0
          : Object.keys(clientsInRoom.sockets).length;

        // let w =
        //   '{"sender_name":"' + user_name +'", "numClients":"' +numClients +'"}';
      let w = {
        sender_name: user_name,
        numClients: numClients
      }
      // console.log(w);
      socket.to(roomId).emit("UserJoin", w);
    });

    socket.on("getNumOfClients", async msg => {
        var clientsInRoom = io.nsps["/api/joinPublicRoom"].adapter.rooms[msg];
        var numClients =
          clientsInRoom === undefined
            ? 0
            : Object.keys(clientsInRoom.sockets).length;
        // console.log(numClients);
        socket.to(msg).emit("onNumOfClients", numClients);
    });

    socket.on("new_comment", async msg => {
      // console.log(msg);
      let objectValue = JSON.parse(msg);
      let message = objectValue["message"];
      let sender_id = objectValue["sender_id"];
      let sender_name = objectValue["sender_name"];
      let img = objectValue["img"];
      let imgs = objectValue["imgs"];
      let room_id = objectValue["room_id"];

      let publicRoomMessage = PublicRoomMessageSchemaModel({
        message: message,
        sender_id: sender_id,
        sender_name: sender_name,
        img: img,
        imgs: imgs,
        room_id: room_id
      });

      await publicRoomMessage.save();

      let user = {};
      try {
        user = await userSchemaModel.findById(sender_id, {password: 0, originPassword: 0, token: 0});
      } catch(err) {}
      
      let w = {
        message: publicRoomMessage.message,
        img: publicRoomMessage.img,
        imgs: publicRoomMessage.imgs,
        imgPath: "roomMessages/img-src/",
        sender_id: publicRoomMessage.sender_id,
        sender_name: publicRoomMessage.sender_name,
        nickname: user.name,
        gender: user.gender,
        like: user.like,
        dislike: user.dislike,
        distance: user.distance,
        online: user.online,
        avatarUrl: user.avatarUrl,
        room_id: publicRoomMessage.room_id,
        createdAt: publicRoomMessage.createdAt,
      }

      // console.log(w);
      // socket.emit("onNewComment", w);
      socket.to(room_id).broadcast.emit("RoomMsgReceive", w);
    });

    socket.on("disconnect", socket => {
      console.log("a user is Disconnected from Public Room ");

    });
  });
};
