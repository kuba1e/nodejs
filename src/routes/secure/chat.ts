import { Router } from "express";
import { chatController } from "../../controllers/chat/chat";

const router = Router();

router.get("/", chatController.getAllActiveUserChatsByUserId);

router.post("/", chatController.create);

router.post("/add-user", chatController.addUserToChatByEmail);

router.delete("/:chatId", chatController.remove);

router.patch("/:chatId", chatController.update);

export default router;
