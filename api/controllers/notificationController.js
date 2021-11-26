"use strict";
//created by Hatem Ragap


const {notificationsSchemaModel} = require('../models/notificationsModel');


module.exports = {

    getNotifications: async (req, res) => {

        const notifications = await notificationsSchemaModel.find({notif_to_user: req.body.user_id}).sort({created: -1});
        if (notifications.length === 0) {
            res.status(500).json({error: true, data: "no Notifications yet"});
        } else {
            res.status(200).json({error: false, data: notifications});
        }

    },


};

 










