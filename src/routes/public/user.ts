import { Router } from "express";
import { login, registration } from "../../controllers/user";

const router = Router();

router.post("/signup", registration);
router.post("/signin", login);

export default router;
