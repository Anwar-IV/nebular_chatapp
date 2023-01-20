import express from "express";
import { router } from "./router/router.js";
import mongoose from "mongoose";
import env from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import { messageModel } from "./schema/messageSchema.js";
env.config();

type MessageType = {
  id: string;
  room: "Nebulon" | "Codex Corner";
  message: string;
};

//Socket io initialization
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

//Connect to Mongo
(async function connectDB() {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI!);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log({ error });
  }
})();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", router);

// Socket io
io.on("connection", (socket) => {
  console.log(`user no. ${socket.id} has connected`);

  socket.on("message-state", async () => {
    try {
      const allMessages: any = await messageModel
        .find({
          room: "Nebulon",
        })
        .sort({ createdAt: 1 })
        .populate("userId", "username");

      const nebulonPayload = allMessages.map((message: any) => ({
        id: message._id,
        username: message.userId.username,
        message: message.message,
        sentAt: message.createdAt,
      }));

      io.emit("nebulon-payload", nebulonPayload);
    } catch (error) {
      console.log({ error });
    }
  });

  socket.on("send-message", async (data: MessageType) => {
    try {
      const { id, room, message } = data;
      await messageModel.create({
        userId: id,
        room,
        message,
      });
      const allMessages: any = await messageModel
        .find({
          room: "Nebulon",
        })
        .sort({ createdAt: 1 })
        .populate("userId", "username");

      const nebulonPayload = allMessages.map((message: any) => ({
        id: message._id,
        username: message.userId.username,
        message: message.message,
        sentAt: message.createdAt,
      }));

      console.log(nebulonPayload);
      io.emit("nebulon-payload", nebulonPayload);
    } catch (error: any) {
      if (error.message) {
        console.log(error.message);
      } else {
        console.log({ error });
      }
    }
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`);
  });
});

server.listen(5500, () => console.log("server started on port 5500"));
