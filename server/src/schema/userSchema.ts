import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    refresh_token: {
      type: String,
    },
  },
  { timestamps: true }
);

export const userModel = mongoose.model("User", userSchema, "user_collection");
