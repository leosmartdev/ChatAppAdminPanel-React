//created by Hatem Ragap
const _ = require("underscore");
const { publicChatRoomModel } = require("../models/publicChatRoomModel");
const { userSchemaModel } = require('../models/userModel');
const {
  PublicRoomMessageSchemaModel
} = require("../models/PublicRoomsMessagesModel");
const BlockLimitedWord = require('../models/BlockLimitedWord');
const ProhibitedWord = require('../models/ProhibitedWord');
const mongoose = require("mongoose");

function has10OrLessCJK(text) {
  return /^[\u3000\u3400-\u4DBF\u4E00-\u9FFF]{0,9}$/.test(text);
}

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
      let messageId = objectValue["messageId"];

      const sender = await userSchemaModel.findById(sender_id);
      const receiverList = await userSchemaModel.aggregate([
          {
              $geoNear: {
                  near: {
                      type: "Point",
                      coordinates: sender.location.coordinates
                  },
                  distanceField: "distance",
                  includeLocs: "location",
                  // spherical: true,
                  minDistance: 0
              }
          },
          {
              $match: { _id: { $ne: new mongoose.Types.ObjectId(sender_id)}, online: true }
          },
          { $sort : { distance: 1, created: -1 } },
          { $limit: sender.coverage || 50 },
          {
              $project: {
                  token: 0,
                  originPassword: 0,
                  password: 0
              }
          }
      ]).exec();

      let receiverIds = receiverList.map((value, index) => value._id);
      receiverIds.push(sender_id);

      // message forbidden words replace with ***
      const prohibitedwordsList = await ProhibitedWord.find().select({'word': 1});
      const prohibitedwords = await prohibitedwordsList.map((value) => value.word.toLowerCase());
      // const limitblockwordsList = await BlockLimitedWord.find().select({'word': 1});
      // const limitblockwords = await limitblockwordsList.map((value) => value.word.toLowerCase());
      const limitblockwords = [];
      const forbiddenWords = [...prohibitedwords, ...limitblockwords];
      let lcmessage = message.toLowerCase();
      for (let i = 0; i < forbiddenWords.length; i++) {
          const word = forbiddenWords[i];
          let replaceString = '';
          for (let j = 0; j < word.length; j++) {
              replaceString = replaceString.concat('*');
          }
          if (has10OrLessCJK(word)) {     // if chinese word
              // console.log(word, replaceString);
              lcmessage = lcmessage.replace(new RegExp(`${word}`, 'g'), replaceString);
          }
          else {
              lcmessage = lcmessage.replace(new RegExp(`\\b${word}\\b`, 'g'), replaceString);
          }
      }
      for (let j = 0; j < lcmessage.length; j++) {
          if (lcmessage[j] == '*') {
              let a = message.split("");
              a[j] = '*';
              message = a.join("");
          }
      }

      let publicRoomMessage = PublicRoomMessageSchemaModel({
        _id: messageId,
        message: message,
        sender_id: sender_id,
        sender_name: sender_name,
        img: img,
        imgs: imgs,
        room_id: room_id,
        receiver_ids: receiverIds
      });

      await publicRoomMessage.save();

      let user = {};
      let credit = 0;
      try {
        user = await userSchemaModel.findById(sender_id, {password: 0, originPassword: 0, token: 0});
        credit = user.like && Number((user.like / (user.like + user.dislike) * 100).toFixed(2));
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
        email: user.email,
        like: user.like,
        dislike: user.dislike,
        credit: String(credit),
        online: user.online,
        avatarUrl: user.avatarUrl,
        room_id: publicRoomMessage.room_id,
        createdAt: publicRoomMessage.createdAt,
        receiver_ids: receiverIds
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
