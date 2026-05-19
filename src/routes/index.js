import { Router } from "express";
import authRouter from "./auth.routes.js";
import meliRouter from "./meli.routes.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({ ok: true });
});

router.use("/auth", authRouter);
router.use("/meli", meliRouter);

export default router;