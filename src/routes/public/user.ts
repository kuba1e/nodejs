import { Router } from "express";
import { userController } from "../../controllers/user/user";

const router = Router();

router.post("/signup", userController.registration);
router.post("/signin", userController.login);

export default router;
