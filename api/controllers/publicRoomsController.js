"use strict";
//created by Hatem Ragap
const Joi = require('joi');

const {publicChatRoomModel} = require('../models/publicChatRoomModel');


module.exports = {

    createRoom: async (req, res) => {
        let img;
        if(req.file)
          img = req.file.filename;
        const {room_name} = req.body;

        var roomModel;

        if (img) {
            roomModel = publicChatRoomModel({
                room_name: room_name,
                img: img
            });
        } else {
            roomModel = publicChatRoomModel({
                room_name: room_name,
            });
        }
        await roomModel.save(async err => {
            if (err) {
                res.status(500).json({
                    error: true,
                    data: "unknown error" + err,
                    chatId: []
                });
            } else {
                res.status(200).json({error: false, data: roomModel});
            }
        });
    },

    getRooms: async (req, res) => {

        const rooms = await publicChatRoomModel.find().sort({created: -1});
        if (rooms.length === 0) {
            res.status(200).json({error: false, data: []});
        } else {
            res.status(200).json({error: false, data: rooms});
        }

    },

    deleteRoom:async (req,res)=>{

      let id = req.params.roomId ;
      await publicChatRoomModel.findByIdAndRemove(id);

      res.send({error:false});

    }

};


function idValidation(id) {
    const schema = Joi.object().keys({
        user_id: Joi.required(),
    });
    return Joi.validate(id, schema);
}










