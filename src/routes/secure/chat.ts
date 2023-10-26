import { Router } from "express";
import { createChat, deleteChat, updateChat } from "../../controllers/chat";

const router = Router();

router.post("/", createChat);

router.delete("/:chatId", deleteChat);

router.patch("/:chatId", updateChat);

export default router;
