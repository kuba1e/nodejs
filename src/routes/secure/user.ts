import { Router } from "express";
import { userController } from "../../controllers/user/user";

const router = Router();

router.get("/", userController.getByEmail);

export default router;
