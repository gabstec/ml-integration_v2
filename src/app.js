import express from "express";
import router from "./routes/index.js";
import { logger } from "./utils/logger.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";
import 'dotenv/config.js';

// 1. PRIMEIRO: Você inicializa a variável 'app'
const app = express();

// 2. DEPOIS: Você usa o 'app' para registrar os middlewares
app.use(cookieParser());
app.use(express.json());
app.use(logger);
app.use(router);
app.use(errorMiddleware);

export default app;