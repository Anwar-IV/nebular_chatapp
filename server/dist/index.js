var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
//Socket io initialization
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
    },
});
//Connect to Mongo
(function connectDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const connection = yield mongoose.connect(process.env.MONGO_URI);
            console.log("Connected to MongoDB");
        }
        catch (error) {
            console.log({ error });
        }
    });
})();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", router);
// Socket io
io.on("connection", (socket) => {
    console.log(`user no. ${socket.id} has connected`);
    socket.on("message-state", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const allMessages = yield messageModel
                .find({
                room: "Nebulon",
            })
                .sort({ createdAt: 1 })
                .populate("userId", "username");
            const nebulonPayload = allMessages.map((message) => ({
                id: message._id,
                username: message.userId.username,
                message: message.message,
                sentAt: message.createdAt,
            }));
            io.emit("nebulon-payload", nebulonPayload);
        }
        catch (error) {
            console.log({ error });
        }
    }));
    socket.on("send-message", (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id, room, message } = data;
            yield messageModel.create({
                userId: id,
                room,
                message,
            });
            const allMessages = yield messageModel
                .find({
                room: "Nebulon",
            })
                .sort({ createdAt: 1 })
                .populate("userId", "username");
            const nebulonPayload = allMessages.map((message) => ({
                id: message._id,
                username: message.userId.username,
                message: message.message,
                sentAt: message.createdAt,
            }));
            console.log(nebulonPayload);
            io.emit("nebulon-payload", nebulonPayload);
        }
        catch (error) {
            if (error.message) {
                console.log(error.message);
            }
            else {
                console.log({ error });
            }
        }
    }));
    socket.on("disconnect", () => {
        console.log(`${socket.id} disconnected`);
    });
});
// Codex
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
app.post("/codex", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { prompt } = req.body;
    console.log({ prompt });
    try {
        const completion = yield openai.createCompletion({
            model: "text-davinci-003",
            prompt,
            temperature: 0,
            max_tokens: 2000,
        });
        console.log(completion.data.choices[0].text);
        res.status(200).json(completion.data.choices[0].text);
    }
    catch (error) {
        if (error.response) {
            console.log(error.response.status, error.response.data);
            res.status(error.response.status).json(error.response.data);
        }
        else {
            console.error(`Error with OpenAI API request: ${error.message}`);
            res.status(500).json({
                error: {
                    message: "An error occurred during your request.",
                },
            });
        }
    }
}));
server.listen(5500, () => console.log("server started on port 5500"));
