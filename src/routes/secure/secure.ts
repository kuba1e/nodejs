import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";

import messageRoutes from "./messages";
import chatRoutes from "./chat";
import userRoutes from "./user";

const router = Router();

function buildSecureRoutes() {
  router.use(authMiddleware());
  router.use("/messages", messageRoutes);
  router.use("/chat", chatRoutes);
  router.use("/user", userRoutes);

  return router;
}

export default buildSecureRoutes();
