import { Router } from "express";
import {
  createMessage,
  deleteMessage,
  getMessages,
  updateMessage,
} from "../../controllers/messages";

const router = Router();

router.get("/", getMessages);

router.post("/", createMessage);

router.patch("/:id", updateMessage);

router.delete("/:id", deleteMessage);

export default router;
