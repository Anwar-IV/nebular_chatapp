import express from "express";
import { router } from "./router/router.js";
import mongoose from "mongoose";
import env from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import { messageModel } from "./schema/messageSchema.js";
import { Configuration, OpenAIApi } from "openai";
env.config();

const PORT = process.env.PORT || 5500;

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
    origin: "https://relaxed-daffodil-a6d106.netlify.app",
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
    origin: "https://relaxed-daffodil-a6d106.netlify.app",
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

// Codex
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

app.post("/codex", async (req, res) => {
  const { prompt } = req.body;
  console.log({ prompt });
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      temperature: 0,
      max_tokens: 2000,
    });
    console.log(completion.data.choices[0].text);
    res.status(200).json(completion.data.choices[0].text);
  } catch (error: any) {
    if (error.response) {
      console.log(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
});
server.listen(PORT, () => console.log(`server started on port ${PORT}`));
