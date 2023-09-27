import express from "express";
import messagesRoutes from "./routes/messages";
import errorHandler from "./middlewares/errorHandler";
import { cors } from "./middlewares/cors";
import { optionsMiddleware } from "./middlewares/optionsMiddleware";

const PORT = 5000;

const app = express();

app.use(express.json());

app.use(cors);

app.options("*", optionsMiddleware);

app.use(messagesRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}.`);
});
