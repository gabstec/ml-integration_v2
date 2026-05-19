import express from "express";
import router from "./routes/index.js";
import { logger } from "./utils/logger.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

app.use(express.json());
app.use(logger);
app.use(router);
app.use(errorMiddleware);

export default app;