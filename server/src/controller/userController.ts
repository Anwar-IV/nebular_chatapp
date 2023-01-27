import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { userModel } from "../schema/userSchema.js";
import bcrypt from "bcryptjs";

export const register = async (req: any, res: Response) => {
  try {
    //DESTRUCTURE USERNAME AND PASSWORD
    const { username, password } = req.body;

    // CREATE TOKENS
    const refresh_token = jwt.sign(
      { username },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: "10h" }
    );
    const access_token = jwt.sign(
      { username },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: 60 }
    );

    //Check username exists in db
    const user_exists = await userModel.findOne({ username });

    if (user_exists) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    const new_user = await userModel.create({
      username,
      password: hashedPassword,
      refresh_token,
    });

    res.cookie("refresh", refresh_token);
    res.cookie("access", access_token);

    res.status(201).json({
      _id: new_user._id,
      username: new_user.username,
      createdAt: new_user.createdAt,
      updatedAt: new_user.updatedAt,
    });
  } catch (error) {
    throw error;
  }
};

export const login = async (req: any, res: Response) => {
  try {
    //Destructure username and password from req.body
    const { username, password } = req.body;

    //Search database for user
    const isUser = await userModel.findOne({ username });

    //If no user return status 404
    if (!isUser) return res.status(404).json({ msg: "User not found" });

    //Else check if passwords match
    const passwordMatch = await bcrypt.compare(password, isUser.password);
    console.log({ passwordMatch });
    //If they do not return status 403
    if (!passwordMatch)
      return res.status(403).json({ msg: "Incorrect Credentials" });

    //Generate new refresh_token && access token
    const refresh_token = jwt.sign(
      { username },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: "10h" }
    );
    const access_token = jwt.sign(
      { username },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: 60 }
    );

    //Update refresh token in db
    const updated = await userModel.findByIdAndUpdate(isUser.id, {
      refresh_token,
    });
    console.log({ updated });

    //Set the refresh && access token cookies && return user
    res.cookie("refresh", refresh_token, { httpOnly: true });
    res.cookie("access", access_token, { httpOnly: true });
    res.status(200).json({
      _id: isUser._id,
      username: isUser.username,
      createdAt: isUser.createdAt,
      updatedAt: isUser.updatedAt,
    });
  } catch (error) {
    console.log("Line number 51 --  userController");
    throw error;
  }
};

export const signout = (req: any, res: Response) => {
  console.log(req.cookies);
  res.cookie("access", "");
  res.cookie("refresh", "");
  res.sendStatus(200);
};
