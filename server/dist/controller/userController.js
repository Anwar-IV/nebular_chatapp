var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from "jsonwebtoken";
import { userModel } from "../schema/userSchema.js";
import bcrypt from "bcryptjs";
export const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //DESTRUCTURE USERNAME AND PASSWORD
        const { username, password } = req.body;
        // CREATE TOKENS
        const refresh_token = jwt.sign({ username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "10h" });
        const access_token = jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 60 });
        //Check username exists in db
        const user_exists = yield userModel.findOne({ username });
        if (user_exists) {
            return res.status(400).json({ msg: "User already exists" });
        }
        // HASH PASSWORD
        const hashedPassword = yield bcrypt.hash(password, 10);
        const new_user = yield userModel.create({
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
    }
    catch (error) {
        throw error;
    }
});
export const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Destructure username and password from req.body
        const { username, password } = req.body;
        //Search database for user
        const isUser = yield userModel.findOne({ username });
        //If no user return status 404
        if (!isUser)
            return res.status(404).json({ msg: "User not found" });
        //Else check if passwords match
        const passwordMatch = yield bcrypt.compare(password, isUser.password);
        console.log({ passwordMatch });
        //If they do not return status 403
        if (!passwordMatch)
            return res.status(403).json({ msg: "Incorrect Credentials" });
        //Generate new refresh_token && access token
        const refresh_token = jwt.sign({ username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "10h" });
        const access_token = jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 60 });
        //Update refresh token in db
        const updated = yield userModel.findByIdAndUpdate(isUser.id, {
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
    }
    catch (error) {
        console.log("Line number 51 --  userController");
        throw error;
    }
});
export const signout = (req, res) => {
    console.log(req.cookies);
    res.cookie("access", "");
    res.cookie("refresh", "");
    res.sendStatus(200);
};
