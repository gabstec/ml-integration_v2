import { Router } from "express";
import * as authController from "../modules/auth/auth.controller.js";

const authRouter = Router();

authRouter.get("/login", authController.login);
authRouter.get("/callback", authController.callback);

export default authRouter;