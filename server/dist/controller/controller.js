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
export const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //DESTRUCTURE USERNAME AND PASSWORD
        const { username, password } = req.body;
        // CREATE TOKENS
        const refresh_token = jwt.sign({ username }, process.env.REFRESH_TOKEN_SECRET);
        const access_token = jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET);
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
        req.refresh_token = refresh_token;
        req.access_token = access_token;
        req.user = new_user;
        next(false);
    }
    catch (error) {
        throw error;
    }
});
