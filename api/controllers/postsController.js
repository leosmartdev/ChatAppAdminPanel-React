"use strict";
//created by Hatem Ragap
const Joi = require('joi');
const {postSchemaModel} = require('../models/postsModel')
const {commentSchemaModel} = require('../models/commentsModel')
const {likeSchemaModel} = require('../models/likesModel')

module.exports = {

    createPost: async (req, res) => {
        const {error} = createPostValidation(req.body);
        if (!error) {
            const {user_id, post_data} = req.body;
            let has_img = false;
            let post_img = null;
            if (req.file) {
                has_img = true;
                post_img = req.file.filename;
            }
            const postModel = postSchemaModel({
                post_data: `${post_data}`,
                has_img: has_img,
                post_img: post_img,
                user_id: user_id
            });
            postModel.save(async err => {
                if (err) {
                    res.status(500).json({
                        error: true,
                        data: "err" + err,
                    });
                } else {
                    res.status(200).json({error: false, data: postModel});
                }
            });
        } else {
            let detail = error.details[0].message;
            res.status(400).send({error: true, data: detail});
        }
    },

    getPosts: async (req, res) => {
        const {error} = getPostsValidation(req.body);

        if (!error) {
            let results = {};
            const {user_id, page} = req.body;

            const page_as_int = parseInt(page);
            const limit = parseInt('10');
            const startIndex = (page_as_int - 1) * limit;
            const endIndex = page_as_int * limit;

            const posts = await postSchemaModel.find()
                .limit(limit)
                .skip(startIndex)
                .sort({createdAt: -1})
                .populate(user_id)
                .populate("user_id", "img user_name _id");

            if (posts.length === 0) {
                results.error = true;
                results.data = 'No posts ';
                res.send(results);
            } else {
                let totalCommentCount = await postSchemaModel.countDocuments().exec();
                if (endIndex < totalCommentCount) {
                    results.next = {
                        page: page_as_int + 1,
                        limit: limit
                    };
                }

                if (startIndex > 0) {
                    results.previous = {
                        page: page_as_int - 1,
                        limit: limit
                    };
                }

                posts.forEach((post) => {
                    post.isUserLiked = post.usersLiked.includes(user_id)
                });
                res.send({error: false, totalCommentCount: totalCommentCount, data: posts});

            }

        } else {
            let detail = error.details[0].message;
            res.status(400).send({error: true, data: detail});
        }
    },
    
    fetch_posts_by_user_id: async (req, res) => {

        let results = {}
        const {peer_id, user_id} = req.body;

        const posts = await postSchemaModel.find({user_id: peer_id})
            .sort({createdAt: -1})
            .populate(peer_id)
            .populate("user_id", "img user_name _id");
        if (posts.length === 0) {
            results.error = true;
            results.data = 'No posts ';
            res.send(results);
        } else {

            posts.forEach((post) => {
                post.isUserLiked = post.usersLiked.includes(user_id)
            });

            res.send({error: false, data: posts});

        }

    },

    deletePost: async (req, res) => {

        const {post_id} = req.body;

        await postSchemaModel.findByIdAndRemove(post_id);
        await commentSchemaModel.find({post_id: post_id}).remove();
        await likeSchemaModel.find({post_id: post_id}).remove();
        res.status(200).json({error: false, data: 'done'});

    }, 
    
    getPostById: async (req, res) => {

        let results = {}
        const {post_id, peer_id} = req.body;

        const posts = await postSchemaModel.findById(post_id)
            .populate(peer_id)
            .populate("user_id", "img user_name _id");
        if (posts.length === 0) {
            results.error = true;
            results.data = 'Post deleted ! ';
            res.send(results);
        } else {


            res.send({error: false, data: posts});

        }

    }


};

function createPostValidation(post) {
    const schema = Joi.object().keys({
        post_data: Joi.string().required(),
        user_id: Joi.string().required()
    });
    return Joi.validate(post, schema);
}

function getPostsValidation(post) {
    const schema = Joi.object().keys({
        user_id: Joi.required(),
        page: Joi.required(),
    });
    return Joi.validate(post, schema);
}










