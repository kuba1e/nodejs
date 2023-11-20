import { Router } from "express";
import { authenticationController } from "../../controllers/auth/authentication";

const router = Router();

router.post("/signup", authenticationController.registration);
router.post("/signin", authenticationController.login);

export default router;
