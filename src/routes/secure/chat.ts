import { Router } from "express";
import { chatController } from "../../controllers/chat/chat";

const router = Router();

router.get("/", chatController.getAllActiveByUserId);

router.post("/", chatController.create);

router.delete("/:chatId", chatController.remove);

router.patch("/:chatId", chatController.update);

export default router;
