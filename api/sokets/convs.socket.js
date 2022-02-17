//created by Hatem Ragap
const _ = require("underscore");
const {roomsSchemaModel} = require('../models/conversionsModel');

function has10OrLessCJK(text) {
    return /^[\u3000\u3400-\u4DBF\u4E00-\u9FFF]{0,9}$/.test(text);
}

module.exports = io => {

    io.of("/api/chatRoomList").on('connection', (socket) => {

        socket.on("getConversionsList", async (id) => {
            //data will send as this for single conversion
            /*   {
                   "error": "false",
                   "data": [
                   {
                       "lastMessage": {
                           "users_see_message": ["5e732abc41166a00173ab507"],
                           "message": "hgf"
                       },
                       "users": [
                           {
                               "token": "user token",
                               "img": "default-user-profile-image.png",
                               "_id": "5e732abc41166a00173ab507",
                               "user_name": "gdfgsdf"
                           },
                           {
                               "token": "fiLeEB6sFFE:-bp-xKC34TFVlrUXC",
                               "img": "1584605354597-received_479678612912945.png",
                               "_id": "5e72744475d74e0017a62f5a",
                               "user_name": "Admin"
                           }
                       ],
                       "created": "2020-03-19T08:48:48.629Z",
                       "_id": "5e7331ea41166a00173ab508",
                       "createdAt": "2020-03-19T08:48:42.682Z",
                       "updatedAt": "2020-03-19T08:48:48.667Z",
                       "__v": 0
                   }
               ],
                   "onLineUsersId": ["5e732abc41166a00173ab507"]
               }*/

            const keys = Object.keys(io.onlineUsers);
            let result = {};
            try {
                let chats = await roomsSchemaModel.find({users: id}).sort({created: -1}).populate("users", "_id img user_name token");

                result.error = false;
                result.data = chats;
                result.onLineUsersId = keys;
                socket.emit('ConversionsListReady', result);
            } catch (error) {
                result.onLineUsersId = [];
                result.error = true;
                result.data = `there are error ${error.message}`;
                socket.emit('ConversionsListReady', result);
            }

        });

    });

};
