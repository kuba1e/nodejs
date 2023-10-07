import "dotenv/config";
import express from "express";
import { cors } from "./middlewares/cors";
import { optionsMiddleware } from "./middlewares/optionsMiddleware";
import responseMiddleware from "./middlewares/responseMiddleware";
import morganMiddleware from "./middlewares/morgan";
import { secureRoutes } from "./routes/secure";
import logger from "./utils/logger";

const PORT = process.env.PORT ?? 5000;

const app = express();

app.use(morganMiddleware);

app.use(express.json());

app.use(cors);

app.use(responseMiddleware);

app.options("*", optionsMiddleware);

app.use("/secure", secureRoutes);

app.listen(PORT, () => {
  logger.info(`Server running on ${PORT}.`);
});
