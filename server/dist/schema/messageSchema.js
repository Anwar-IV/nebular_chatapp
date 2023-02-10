import mongoose from "mongoose";
const messageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    message: { type: String, required: true },
    room: { type: String, required: true },
}, { timestamps: true });
export const messageModel = mongoose.model("Message", messageSchema, "message_collection");
messageSchema.index({ createdAt: -1 });
