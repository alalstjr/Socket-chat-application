const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const cors = require('cors');

const { addUser, removeUser, getUser, getUsersInRoom } = require("./users");

const PORT = process.env.PORT || 5000

const router = require("./router");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(router);

io.on("connection", (socket) => {
    console.log("socket.io 연결되었습니다.");

    // client/src/Chat/Chat.js
    // emit 한 join 값을 사용하거나 콜백으로도 사용가능
    socket.on("join", ({ name, room }, callback) => {
        const { error, user } = addUser(
            { 
                id: socket.id,
                name,
                room
            }
        );

        // error 처리
        if(error) return callback(error);

        // room 접근 검증이 통과되었다면 실행되는 메소드
        // 처음 방에 접근했을 때 사용자에게 보여지는 초기 메세지 설정
        socket.emit("message", {
            user: "admin",
            text: `${user.name}님 ${user.room}방에 오신것을 환영합니다.`
        });
        socket.broadcast.to(user.room).emit("message", {
            user: "admin",
            text: `${user.name}님이 입장하였습니다.`
        });

        // socket join 메소드 실행
        socket.join(user.room);

        // 이전에 저장된 채팅목록을 가져와서 client 전달하도록 하는 메소드
        io.to(user.room).emit('roomData', {
            room: user.room, 
            users: getUsersInRoom(user.room)
        });

        callback();
    });

    // 사용자가 전송하는 메세지를 client 로 전송
    socket.on("sendMessage", (message, callback) => {
        const user = getUser(socket.id);

        io.to(user.room).emit("message",{
            user: user.name,
            text: message
        });

        callback();
    });

    socket.on("disconnect", () => {
        console.log("socket.io 연결이 해제되었습니다.");

        const user = removeUser(socket.id); 

        if(user) {
          io.to(user.room).emit('message', { user: 'Admin', text: `${user.name}님이 채팅방에서 나갔습니다.` });
          io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
        }
    });
}); 

app.use(router);

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));