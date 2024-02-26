import express from "express";
import { config } from "dotenv";
import colors from "colors";
import http from "http";
import { Server } from "socket.io";
config({ path: "./.env" });
import { v4 as uuidv4 } from "uuid";
import Auth from './auth.js'
import mongoose from "mongoose";
import cors from 'cors'
const app = express();
const corsOptions = {
  origin: 'https://collage-omegal-9j7b.vercel.app/',
};
app.use(cors(corsOptions));

const server = http.createServer(app);
const io = new Server(server, {
  cors: "*",
});
app.use(express.json());

const emptyrooms = [];
const activeRoom = [];

mongoose.connect(process.env.DB)

app.use('/auth',Auth)


io.on("connection", (socket) => {
  if (emptyrooms.length) {
    const index = Math.floor(Math.random() * emptyrooms.length);
    const room = emptyrooms[index];
    room.user2 = socket.id;
    emptyrooms.splice(index, 1);
    activeRoom.push(room);
    socket.emit("room", room);
    io.to(room.user1).emit("user2Joined", room);
  } else {
    const id = uuidv4();
    const room = { id: id, user1: socket.id, user2: null };
    emptyrooms.push(room);
    socket.emit("room", room);
  }
  socket.on("disconnect", () => {
    for (let i = 0; i < activeRoom.length; i++) {
      if (
        activeRoom[i].user1 === socket.id ||
        activeRoom[i].user2 === socket.id
      ) {
        const userLeftId =
          activeRoom[i].user1 === socket.id
            ? activeRoom[i].user2
            : activeRoom[i].user1;
        io.to(userLeftId).emit("userLeft");
        activeRoom.splice(i, 1);
        break;
      }
    }
    for (let i = 0; i < emptyrooms.length; i++) {
      if (
        emptyrooms[i].user1 === socket.id ||
        emptyrooms[i].user2 === socket.id
      ) {
        const userLeftId =
          emptyrooms[i].user1 === socket.id
            ? emptyrooms[i].user2
            : emptyrooms[i].user1;
        io.to(userLeftId).emit("userLeft");
        emptyrooms.splice(i, 1);
        break;
      }
    }
  });

  socket.on("chat-message", async (roomid, message) => {
    try {
      const room = activeRoom.find((room) => room.id === roomid);
      io.to(room.user1).emit("chat-message", message, socket.id);
      io.to(room.user2).emit("chat-message", message, socket.id);
    } catch (error) {
      console.error("Error handling chat message:", error);
    }
  });
});

server.listen(process.env.PORT, () => {
  console.log(
    "Server is running on port " +
      colors.cyan(`http://localhost:${process.env.PORT}`)
  );
});
