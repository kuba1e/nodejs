import { Router } from "express";
import {
  createMessage,
  deleteMessage,
  forwardMessage,
  getMessages,
  updateMessage,
} from "../../controllers/messages";

const router = Router();

router.get("/:chatId", getMessages);

router.post("/:chatId", createMessage);

router.patch("/:messageId", updateMessage);

router.delete("/:messageId", deleteMessage);

router.post("/:chatId/:messageId", forwardMessage);

export default router;
