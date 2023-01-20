import { Response, Router } from "express";
import { authcontrol } from "../controller/authController.js";
import { login, register } from "../controller/userController.js";

export const router = Router();

router.post("/register", register);

router.post("/login", login);

router.get("/getuser", authcontrol);
