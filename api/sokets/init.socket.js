//created by Hatem Ragap
const fs = require("fs");

module.exports = io => {

    io.on("connection", socket => {
        console.log("connect");
        socket.on("goOnline", id => {
            io.onlineUsers[id] = true;
            const keys = Object.keys(io.onlineUsers);
            console.log(`there are ${id} go online`);
            io.of("/api/chatRoomList").emit('onOnlineUserListUpdate', keys);
            socket.on("disconnect", () => {
                delete io.onlineUsers[id];
                const keys = Object.keys(io.onlineUsers);
                io.of("/api/chatRoomList").emit('onOnlineUserListUpdate', keys);
                console.log(`there are ${id} go offline`);
            });
        });
    });

};
