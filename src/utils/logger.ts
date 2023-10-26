import winston from "winston";

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.align(),
  winston.format.printf(
    (info) => `[${info.timestamp}] ${info.level}: ${info.message}`
  )
);

const transports = [
  new winston.transports.Console(),
  new winston.transports.File({ filename: "logs/all.log", level: "http" }),

  new winston.transports.File({
    filename: "logs/error.log",
    level: "error",
  }),

  new winston.transports.File({ filename: "logs/all.log" }),
];

const logger = winston.createLogger({
  format,
  transports,
});

export default logger;
