//created by Hatem Ragap
var mongoose = require('mongoose');


var publicChatRoomSchema = mongoose.Schema({
    room_name: {
        type: String,
        max: 30,
        min: 5
    },
    img: {
        type: String,
        default: 'default-chat-room-image.jpg'
    },
    created: {
        type: Number, default: Date.now
    },
    blocked_users:[{
        type: String,
        ref: 'users',
        default:[]
    }],

});

var publicChatRoomModel = mongoose.model('publicChatRooms', publicChatRoomSchema);

module.exports = {
    publicChatRoomModel,
}
