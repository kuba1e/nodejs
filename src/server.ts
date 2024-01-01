import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { cors } from "./middlewares/cors";
import { optionsMiddleware } from "./middlewares/optionsMiddleware";
import responseMiddleware from "./middlewares/responseMiddleware";
import morganMiddleware from "./middlewares/morgan";
import { secureRoutes } from "./routes/secure";
import logger from "./utils/logger";
import { AppDataSource } from "./data-source";
import { publicRoutes } from "./routes";
import { sendMessageToQueue } from "./middlewares/sqs";

const PORT = process.env.PORT ?? 5000;

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

app.use(cookieParser());

app.use(morganMiddleware);

app.use(express.json());

app.use(cors);

app.use(responseMiddleware);

app.options("*", optionsMiddleware);

app.use("/public", publicRoutes);
app.use("/secure", secureRoutes);

AppDataSource.initialize()
  .then(() => {
    logger.info("Database successfully started");

    app.listen(PORT, () => {
      logger.info(`Server running on ${PORT}.`);
    });

    sendMessageToQueue("Hello from SQS");
  })
  .catch((error) => {
    logger.error(`error from db${error}`);
  });
