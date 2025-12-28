const express = require("express");
const http = require("http");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static("public"));

const rooms = {}; // roomCode -> roomName

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    /* -------- CREATE ROOM (ADMIN) -------- */
    socket.on("createRoom", ({ adminName, roomName }) => {
        const roomCode = Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase();

        rooms[roomCode] = roomName;

        socket.join(roomCode);

        socket.emit("roomCreated", roomCode);
        io.to(roomCode).emit(
            "message",
            `${adminName} (Admin) created the room`
        );

        console.log(`Room created: ${roomName} | Code: ${roomCode}`);
    });

    /* -------- JOIN ROOM (USER) -------- */
    socket.on("joinRoom", ({ username, roomCode }) => {
        if (!rooms[roomCode]) {
            socket.emit("errorMsg", "Invalid room code");
            return;
        }

        socket.join(roomCode);
        socket.emit("joinedSuccess");

        io.to(roomCode).emit(
            "message",
            `${username} joined the room`
        );
    });

    /* -------- CHAT MESSAGE -------- */
    socket.on("chatMessage", ({ username, roomCode, message }) => {
        if (rooms[roomCode]) {
            io.to(roomCode).emit(
                "message",
                `${username}: ${message}`
            );
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
