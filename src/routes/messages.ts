import { Router } from "express";
import {
  createMessage,
  deleteMessage,
  getMessages,
  updateMessage,
} from "../controllers/messages";

const router = Router();

router.get("/messages", getMessages);

router.post("/messages", createMessage);

router.put("/messages/:id", updateMessage);

router.delete("/messages/:id", deleteMessage);

export default router;
