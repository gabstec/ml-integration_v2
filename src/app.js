import express from "express"
import router from "./routes/index.js";
import { logger } from "./utils/logger.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";
import 'dotenv/config.js';
app.use(cookieParser());

const app = express();

app.use(express.json());
app.use(logger);
app.use(router);
app.use(errorMiddleware);

export default app;