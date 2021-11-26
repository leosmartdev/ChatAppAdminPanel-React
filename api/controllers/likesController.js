"use strict";
//created by Hatem Ragap
const Joi = require("joi");

const {postSchemaModel} = require("../models/postsModel");

const {notificationsSchemaModel} = require("../models/notificationsModel");
const {userSchemaModel} = require("../models/userModel");

const {likeSchemaModel} = require("../models/likesModel");
var admin = require("firebase-admin");

module.exports = {
    createLike: async (req, res) => {
        const {user_id, post_id, peer_id, user_name, user_img} = req.body;


        const likeModel = new likeSchemaModel({
            user_id: user_id,
            post_id: post_id
        });
        await likeModel.save(async err => {
            if (err) {
                res.status(500).json({
                    error: true,
                    data: "err" + err
                });
            } else {
                let postData = await postSchemaModel.findById(post_id);

                postData.likes = ++postData.likes;
                postData.usersLiked.push(user_id);

                await postData.save();

                if (user_id !== peer_id) {
                    let userToNotify = await userSchemaModel.findById(peer_id);
                    let peerToken = userToNotify.token;

                    var payload = {
                        notification: {
                            body: `${user_name} has Like your post`,
                            title: "V Chat App"
                        },
                        data: {
                            id: `${post_id}`,
                            post_owner_id: `${peer_id}`,
                            screen: "like",
                            'click_action': 'FLUTTER_NOTIFICATION_CLICK',
                        }
                    };
                    var options = {
                        priority: "high",
                        timeToLive: 60 * 60 * 24
                    };
                    admin
                        .messaging()
                        .sendToDevice(peerToken, payload, options)
                        .then(function (ress) {

                        })
                        .catch(function (err) {
                            console.log("error is " + err);
                        });
                    //save notif
                    let notifModel = new notificationsSchemaModel({
                        name: user_name,
                        title: "Liked your post",
                        userImg: user_img,
                        postId: post_id,
                        notif_to_user: peer_id,
                        my_id: user_id
                    });
                    await notifModel.save();
                }

                res.status(200).json({error: false, data: "done"});
            }
        });
    },
    deleteLike: async (req, res) => {
        const {error} = createLikeValidation(req.body);

        if (!error) {
            const {user_id, post_id} = req.body;

            //   const likeModel = new likeSchemaModel({user_id: user_id, post_id: post_id});
            await likeSchemaModel
                .find({user_id: user_id, post_id: post_id})
                .remove();
            let postData = await postSchemaModel.findById(post_id);

            postData.likes = --postData.likes;
            postData.usersLiked.remove(user_id);
            await postData.save();

            res.status(200).json({error: false, data: "done"});
        } else {
            let detail = error.details[0].message;
            res.status(400).send({error: true, data: detail});
        }
    }
};

function createLikeValidation(like) {
    const schema = Joi.object().keys({
        post_id: Joi.string().required(),
        user_id: Joi.string().required()
    });
    return Joi.validate(like, schema);
}
