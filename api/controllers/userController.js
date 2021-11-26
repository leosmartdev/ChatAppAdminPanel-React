"use strict";
//created by Hatem Ragap
const Joi = require('joi');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const passwordHash = require("password-hash");
const {userSchemaModel} = require('../models/userModel');
const {postSchemaModel} = require('../models/postsModel');
const {likeSchemaModel} = require('../models/likesModel');
const {commentSchemaModel} = require('../models/commentsModel');
const {UserSpecialPermssionSchemaModel} = require('../models/UserSpecialPermssionModel');
const {settingsSchemaModel} = require('../models/settingsModel');

module.exports = {
    createUser: async (req, res) => {
        const {error} = createUserValidation(req.body);
        if (!error || 1) {
            const {name, email, password, gender, role, phoneNumber, address, isVerified, status, note} = req.body;
            let {location} = req.body;
            const hashedPassword = await passwordHash.generate(password);

            const user = await userSchemaModel.findOne({ email });

            if (user) {
                return res.status(401).json({
                    success: false,
                    message: "The email already exists. Please choose another."
                });
            }

            if (location) {
                const locationObj = location.split(',');
                location = {
                    type: "Point",
                    coordinates: [Number(locationObj[0].trim()),Number(locationObj[1].trim())]
                };
            }

            return new Promise((resolve, reject) => {
                const params = {
                    name: name,
                    email: email,
                    gender: gender,
                    password: hashedPassword,
                    originPassword: password,
                    role: role,
                    phoneNumber: phoneNumber,
                    address: address,
                    location: location,
                    isVerified: isVerified,
                    status: status,
                    note: note,
                    created: new Date()
                };
                const userModel = userSchemaModel(params);
                userModel.save(async err => {
                    if (err) {
                      res.status(401).json({
                        success: false,
                        message: err.message
                      });
                    } else {
                      const accessToken = jwt.sign({ userModel }, 'secret');
                      res.json({
                        success: true,
                        message: 'create user successfully',
                        accessToken: accessToken,
                        user: userModel
                      });
                    }
                });
            });
        } else {
            let detail = error.details[0].message;
            res.status(400).send({error: true, data: detail});
        }
    },
    updateUser: async (req, res) => {
        const {name, email, password, gender, role, phoneNumber, address, isVerified, status, note, avatarUrl, balance, balanceCurrency, punishment, fixedLocation} = req.body;
        let {location} = req.body;
        if (location) {
            const locationObj = location.split(',');
            location = {
                type: "Point",
                coordinates: [Number(locationObj[0]),Number(locationObj[1])]
            };
        }
        const params = {
            name: name,
            email: email,
            gender: gender,
            role: role,
            phoneNumber: phoneNumber,
            address: address,
            isVerified: isVerified,
            status: status,
            location: location,
            fixedLocation: fixedLocation,
            note: note,
            avatarUrl: avatarUrl,
            balance: balance,
            balanceCurrency: balanceCurrency,
            punishment: punishment
        };
        if (password && password.trim() != "") {
            const hashedPassword = await passwordHash.generate(password.trim());
            params.password = hashedPassword;
            params.originPassword = password.trim();
        }
        if (avatarUrl) {
            params.avatarUrl = avatarUrl.path;
        }
        const user = await userSchemaModel.findByIdAndUpdate( req.params.userId, params).exec((err) => {
            if (err) res.status(400).send({error: true, data: 'err' + err});
            else res.send({error: false, data: user});
        });
        
    },
    deleteUser: async (req, res) => {

        console.log(req.params.userId);

        await userSchemaModel.findByIdAndDelete(req.params.userId).exec((err) => {
            if (err) res.status(400).send({error: true, data: 'err' + err});
            else res.send({error: false});
        });
        
    },
    loginUser: async (req, res) => {
        const {error} = loginUserValidation(req.body);
        if (!error) {
            const {email, password} = req.body;
            const user = await userSchemaModel.findOne({email});
            if (!user) {
                res
                    .status(401)
                    .json({error: true, data: "no email found please register !"});
            }
            const isPasswordMatch = await passwordHash.verify(
                password,
                user.password
            );

            if (!isPasswordMatch) {
                res.status(401).json({error: true, data: "password not match !"});
            } else {
                res.status(200).json({error: false, data: user});
            }
        } else {
            let detail = error.details[0].message;
            res.status(400).send({error: true, data: detail});
        }
    },
    getUser: async (req, res) => {
        const userId = req.params.userId;
        try {
            const user = await userSchemaModel.findById(userId);
            res.status(200).json({error: false, data: user});
        } catch(err) {
            res.status(500).json({error: true, data: "no user found !"});
        }
    },
    getUserByEmail: async (req, res) => {
        if (req.body.email) {
            let email = `${req.body.email}`;
            const user = await userSchemaModel.findOne({email: email});
            if (!user) {
                res.status(404).json({error: true, data: "no user found !"});
            } else {
                res.status(200).json({error: false, data: user});
            }
        } else {
            res.status(400).send({error: true, data: 'user Email required'});
        }
    },
    searchUserByName: async (req, res) => {
        if (req.body.name) {
            const regexQuery = {
                user_name: new RegExp(req.body.name, 'i')
            }
            const users = await userSchemaModel.find(regexQuery,['user_name','email','img','bio']);
            res.status(200).json({error: false, data: users});

        } else {
            res.status(400).send({error: true, data: 'user name required'});
        }
    },
    getUsers: async (req, res) => {
        const user = await userSchemaModel.find({},{
            token: 0
        }).sort({role: 1, created: -1});
        if (!user) {
            res.status(401).json({error: true, data: "no user found !"});
        } else {
            res.status(200).json({error: false, data: user});
        }
    },
    get_likes_posts_comments_counts: async (req, res) => {
        const {error} = idValidation(req.body);
        if (!error) {
            let id = `${req.body.user_id}`;

            let postsCount = await postSchemaModel.find({user_id: id}).countDocuments().exec();
            let likesCount = await likeSchemaModel.find({user_id: id}).countDocuments().exec();
            let commentsCount = await commentSchemaModel.find({user_id: id}).countDocuments().exec();
            res.status(200).json({
                error: false,
                likes: `${likesCount}`,
                posts: `${postsCount}`,
                comments: `${commentsCount}`
            });

        } else {
            let detail = error.details[0].message;
            res.status(400).send({error: true, data: detail});
        }
    },
    addUserImg: async (req, res) => {
        let user_id = req.params.userId;
        let name = req.file.filename;
        // console.log(user_id, name);
        let bio = req.body.bio;
        if (bio) {
            await userSchemaModel.findByIdAndUpdate(user_id, {avatarUrl:name, img: name, bio: bio}).exec((err) => {
                if (err) res.status(400).send({error: true, data: 'err' + err});
                else res.send({error: false, data: name});
            });
        } else {
            await userSchemaModel.findByIdAndUpdate(user_id, {avatarUrl:name, img: name}).exec((err) => {
                if (err) res.status(400).send({error: true, data: 'err' + err});
                else res.send({error: false, data: name});
            });
        }
    },
    getUserImg: async (req, res) => {
        let userId = req.params.userId;
        try {
            const user = await userSchemaModel.findById(userId);
            let file = user.avatarUrl;
            let fileLocation = '';
            if (file) {
                fileLocation = path.resolve(__dirname, '../uploads/users_profile_img', file);
            }
            let fileExist = fs.existsSync(fileLocation)
            if(!fileExist) {
                fileLocation = path.resolve(__dirname, '../uploads/users_profile_img/default-user-profile-image.png');
            }
            //res.send({image: fileLocation});
            // console.log(fileLocation);
            res.sendFile(`${fileLocation}`);
        } catch(err) {
            return res.status(500).json({error: true, data: "no user found !"});
        }
    },
    getImgSrc: async (req, res) => {
        let fileLocation = path.resolve(__dirname, '../uploads/users_profile_img', req.params.imageName);
        let fileExist = fs.existsSync(fileLocation)
        if(!fileExist) {
            fileLocation = path.resolve(__dirname, '../uploads/users_profile_img/default-user-profile-image.png');
        }
        res.sendFile(`${fileLocation}`);
    },
    update_bio: async (req, res) => {
        let user_id = req.body.user_id;
        let bio = req.body.bio;
        const user = await userSchemaModel.findByIdAndUpdate(user_id, {bio: bio}).exec((err) => {
            if (err) res.status(400).send({error: true, data: 'err' + err});
            else res.send({error: false, data: user});
        });
    },
    update_bio_and_name: async (req, res) => {
        let user_id = req.body.user_id;
        let bio = req.body.bio;
        let user_name = req.body.user_name;
        await userSchemaModel.findByIdAndUpdate(user_id, {bio: bio, user_name: user_name}).exec((err) => {
            if (err) res.status(400).send({error: true, data: 'err' + err});
            else res.send({error: false, bio: bio, user_name: user_name});
        });
    },
    updatePassword: asyncHandler(async (req, res) => {
        
        const {error} = updatePasswordValidation(req.body)
        if (!error) {
            let user_id = req.params.userId;
            let old_password = req.body.old_password;
            let new_password = req.body.new_password;
            try {
                const user = await userSchemaModel.findById(user_id);
                
                const isPasswordMatch = await passwordHash.verify(
                    old_password,
                    user.password
                );
                if (!isPasswordMatch) {
                    res.status(401).json({error: true, data: "password not match !"});
                } else {
                    const hashedPassword = await passwordHash.generate(new_password);
                    const user = await userSchemaModel.findByIdAndUpdate( user_id, {password: hashedPassword, originPassword: new_password}).exec((err) => {
                        if (err) res.status(400).send({error: true, data: 'err' + err});
                        else res.send({error: false, data: 'done'});
                    });
                }
            } catch(err) {
                res.status(500).json({error: true, data: "no user found !"});
            }
        } else {
            let detail = error.details[0].message;
            res.status(400).send({error: true, data: detail});
        }

    }),
    updateAndAddUserToken: async function (req, res) {
        if (req.body.id && req.body.token) {

            await userSchemaModel.findByIdAndUpdate(req.body.id, {
                token: req.body.token
            });
            res.json({
                error: false,
                data: 'done'
            });
        } else {
            res.status(400).json({
                error: true,
                data: ' user id is required ! or token '
            });
        }
    },
    saveUserSepcialPermission: async function (req, res) {
        const settings = await UserSpecialPermssionSchemaModel.findOneAndUpdate({userId: req.params.userId}, req.body);

        if (!settings) {
            let userPermissions = req.body;
            userPermissions.userId = req.params.userId;
            const newRow = new UserSpecialPermssionSchemaModel(req.body);
            await newRow.save();
        }
        
        res.json({
            success: true,
            message: 'Saved Successfully !'
        });
    },
    getSpecialPermissions: async (req, res) => {
        const userSpecialPermissions = await UserSpecialPermssionSchemaModel.find();
        if (!userSpecialPermissions) {
            res.status(401).json({error: true, data: "no user special permssions found !"});
        } else {
            res.status(200).json({error: false, data: userSpecialPermissions});
        }
    },
    clearSpecialPermission: async (req, res) => {
        const userId = req.params.userId;
        await UserSpecialPermssionSchemaModel.findOneAndDelete({userId: userId}).exec((err) => {
            if (err) res.status(400).send({error: true, data: 'err' + err});
            else res.send({error: false, data: "Clear Successfully"});
        });
    },
    getUserSettings: async (req, res) => {
        // const {error} = idValidation(req.body);
        // if (!error) {
            const user_id = req.params.userId;
            try {
                const user = await userSchemaModel.findById(user_id);
                const {
                    coverage,
                    use_current_location_as_permanent,
                    display_position_with_random_offset,
                    all_new_message_alert,
                    public_chat_room_me_alert,
                    change_kilometers_to_miles,
                    voice_alert,
                    vibration_alert,
                    do_not_disturb
                } = user;
                const data = {
                    coverage,
                    use_current_location_as_permanent,
                    display_position_with_random_offset,
                    all_new_message_alert,
                    public_chat_room_me_alert,
                    change_kilometers_to_miles,
                    voice_alert,
                    vibration_alert,
                    do_not_disturb
                };
                res.status(200).json({error: false, data: data});
            } catch(err) {
                res.status(500).json({error: true, data: "no user found !"});
            }
        // } else {
        //     let detail = error.details[0].message;
        //     res.status(400).send({error: true, data: detail});
        // }
    },
    setUserSettings: async (req, res) => {
        const user_id = req.params.userId;
        const {
            coverage,
            use_current_location_as_permanent,
            display_position_with_random_offset,
            all_new_message_alert,
            public_chat_room_me_alert,
            change_kilometers_to_miles,
            voice_alert,
            vibration_alert,
            do_not_disturb
        } = req.body;
        try {
            const data = {
                coverage,
                use_current_location_as_permanent,
                display_position_with_random_offset,
                all_new_message_alert,
                public_chat_room_me_alert,
                change_kilometers_to_miles,
                voice_alert,
                vibration_alert,
                do_not_disturb
            };
            const user = await userSchemaModel.findByIdAndUpdate(user_id, data).exec((err) => {
                if (err) res.status(400).send({error: true, data: 'err' + err});
                else res.json({error: false, data: "Saved Successfully"});
            });
        } catch(err) {
            res.status(500).json({error: true, data: "no user found !"});
        }
    },
    getUserGender: async (req, res) => {
        const user_id = req.params.userId;
        try {
            const user = await userSchemaModel.findById(user_id);
            res.status(200).json({error: false, data: user.gender});
        } catch(err) {
            res.status(500).json({error: true, data: "no user found !"});
        }
    },
    setUserGender: async (req, res) => {
        const user_id = req.params.userId;
        const {
            gender
        } = req.body;
        try {
            const user = await userSchemaModel.findByIdAndUpdate(user_id, { gender }).exec((err) => {
                if (err) res.status(400).send({error: true, data: 'err' + err});
                else res.json({error: false, data: "Saved Successfully"});
            });
        } catch(err) {
            res.status(500).json({error: true, data: "no user found !"});
        }
    },
    getUserName: async (req, res) => {
        const user_id = req.params.userId;
        try {
            const user = await userSchemaModel.findById(user_id);
            res.status(200).json({error: false, data: user.name});
        } catch(err) {
            res.status(500).json({error: true, data: "no user found !"});
        }
    },
    setUserName: async (req, res) => {
        const user_id = req.params.userId;
        const {
            nickname
        } = req.body;
        try {
            const user = await userSchemaModel.findByIdAndUpdate(user_id, { name: nickname }).exec((err) => {
                if (err) res.status(400).send({error: true, data: 'err' + err});
                else res.json({error: false, data: "Saved Successfully"});
            });
        } catch(err) {
            res.status(500).json({error: true, data: "no user found !"});
        }
    },
    getLocalUsers: async (req, res) => {
        const userId = req.params.userId;
        // const userList = await userSchemaModel.find({},{
        //     token: 0,
        //     originPassword: 0,
        //     password: 0
        // }).where("_id").ne(userId).sort({role: 1, created: -1}).exec();

        try {
            const user = await userSchemaModel.findById(userId);
            const userList = await userSchemaModel.aggregate([
                {
                    $geoNear: {
                        near: {
                            type: "Point",
                            coordinates: user.location.coordinates
                        },
                        distanceField: "distance",
                        includeLocs: "location",
                        // spherical: true,
                        minDistance: 0
                    }
                },
                {
                    $match: { _id: { $ne: userId}}
                },
                { $sort : { role: 1, created: -1 } },
                {
                    $project: {
                        token: 0,
                        originPassword: 0,
                        password: 0
                    }
                }
            ]).exec();

            let localUsers = userList.map((value, index) => {
                let like = value.like;
                let dislike = value.dislike;
                let credit = like && Math.round(like / (like + dislike) * 100);
                return {
                    _id: value._id,
                    name: value.name,
                    email: value.email,
                    role: value.role,
                    gender: value.gender,
                    like: value.like,
                    dislike: value.dislike,
                    credit: credit,
                    distance: value.distance,
                    distancekm: `${(value.distance/1000).toFixed(2)}km`,
                }
            });
            localUsers.sort((a, b) => a.distance > b.distance);
            res.status(200).json({error: false, data: localUsers});
        } catch(err) {
            res.status(400).send({error: true, data: err.message});
        }
    },
    getLocation: async (req, res) => {
        const user_id = req.params.userId;
        try {
            const user = await userSchemaModel.findById(user_id);
            res.status(200).json({error: false, data: user.location});
        } catch(err) {
            res.status(500).json({error: true, data: "no user found !"});
        }
    },
    setLocation: async (req, res) => {
        const user_id = req.params.userId;
        let {location} = req.body;
        const locationObj = location.split(',');
        location = {
            type: "Point",
            coordinates: [Number(locationObj[0]),Number(locationObj[1])]
        };
        try {
            const user = await userSchemaModel.findByIdAndUpdate(user_id, { location: location }).exec((err) => {
                if (err) res.status(400).send({error: true, data: 'err' + err});
                else res.json({error: false, data: "Saved Successfully"});
            });
        } catch(err) {
            res.status(500).json({error: true, data: "no user found !"});
        }
    },
    setLike: async (req, res) => {
        const userId = req.params.userId;
        const posterId = req.params.posterId;
        try {
            const user = await userSchemaModel.findById(userId);
            let {likeUsers, dislikeUsers, like, dislike} = user;
            if (likeUsers.indexOf(posterId) > -1) 
                return res.json({error: false, data: "Already Done"});
            if (dislikeUsers.indexOf(posterId) > -1) {
                dislike > 0 && dislike --;
                dislikeUsers.splice(dislikeUsers.indexOf(posterId),1);
            }
            like ++;
            likeUsers.push(posterId);
            await userSchemaModel.findByIdAndUpdate(userId, {like, dislike, likeUsers, dislikeUsers}).exec((err) => {
                if (err) res.status(400).send({error: true, data: 'err' + err});
                else res.json({error: false, data: "Saved Successfully"});
            });
        } catch(err) {
            res.status(500).json({error: true, data: "no user found !"});
        }
    },
    setDislike: async (req, res) => {
        const userId = req.params.userId;
        const posterId = req.params.posterId;
        try {
            const user = await userSchemaModel.findById(userId);
            let {likeUsers, dislikeUsers, like, dislike} = user;
            if (dislikeUsers.indexOf(posterId) > -1) 
                return res.json({error: false, data: "Already Done"});
            if (likeUsers.indexOf(posterId) > -1) {
                like > 0 && like --;
                likeUsers.splice(likeUsers.indexOf(posterId),1);
            }
            dislike ++;
            dislikeUsers.push(posterId);
            await userSchemaModel.findByIdAndUpdate(userId, {like, dislike, likeUsers, dislikeUsers}).exec((err) => {
                if (err) res.status(400).send({error: true, data: 'err' + err});
                else res.json({error: false, data: "Saved Successfully"});
            });
        } catch(err) {
            res.status(500).json({error: true, data: "no user found !"});
        }
    },
    getUserDetails: async (req, res) => {
        const userId = req.params.userId;
        try {
            const userDetailsSchema = await userSchemaModel.findById(userId, {
                token: 0, password: 0, originPassword: 0, img: 0
            });
            let userDetails = userDetailsSchema.toObject();
            userDetails.credit = userDetails.like && Math.round(userDetails.like / (userDetails.like + userDetails.dislike) * 100);
            const userSpecialPermssions = await UserSpecialPermssionSchemaModel.findOne({userId: userId});
            const parameterSettings = await settingsSchemaModel.findOne({type: "parameter"});
            if (userSpecialPermssions && userSpecialPermssions.max_coverage) {
                userDetails.max_coverage = userSpecialPermssions.max_coverage;
            } 
            else {
                userDetails.max_coverage = (parameterSettings && parameterSettings.settings.default_coverage) || 150;
            }
            if (userSpecialPermssions) {
                userDetails.specialPermissions = userSpecialPermssions;
            }
            res.json({error: false, data: userDetails});
        } catch(err) {
            res.status(500).json({error: true, data: "no user found !"});
        }
    },
};

function createUserValidation(user) {
    const schema = Joi.object().keys({
        name: Joi.string().min(3).max(30).required(),
        email: Joi.string().email({minDomainAtoms: 2}).max(30).required(),
        password: Joi.string().min(3).max(30).required(),
    });
    return Joi.validate(user, schema);
}

function updatePasswordValidation(user) {
    const schema = Joi.object().keys({
        // user_id: Joi.string().required(),
        old_password: Joi.string().min(5).max(30).required(),
        new_password: Joi.string().min(5).max(30).required(),
    });
    return Joi.validate(user, schema);
}

function loginUserValidation(user) {
    const schema = Joi.object().keys({
        email: Joi.string().required(),
        password: Joi.string().required(),
    });
    return Joi.validate(user, schema);
}

function idValidation(id) {
    const schema = Joi.object().keys({
        user_id: Joi.required(),
    });
    return Joi.validate(id, schema);
}
