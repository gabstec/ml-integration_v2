import { Router } from "express";
import { getToken } from "../modules/auth/auth.repository.js";

const meliRouter = Router();

meliRouter.get("/token", (req, res) => {
  res.json(getToken());
});

export default meliRouter;