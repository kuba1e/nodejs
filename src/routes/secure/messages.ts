import { Router } from "express";
import { messageController } from "../../controllers/message/message";

const router = Router();

router.get("/:chatId", messageController.getByChatId);

router.post("/:chatId", messageController.create);

router.patch("/:messageId", messageController.update);

router.delete("/:messageId", messageController.remove);

router.post("/:chatId/:messageId", messageController.forward);

export default router;
