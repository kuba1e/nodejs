import morgan from "morgan";
import logger from "../utils/logger";

const fs = require("fs");
const path = require("path");

const stream = {
  write: (message) => logger.http(message),
};

const morganMiddleware = morgan(
  ":remote-addr :method :url :status :res[content-length] - :response-time ms",
  { stream }
);

export default morganMiddleware;
