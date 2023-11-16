import { Router } from "express";

import messageRoutes from "./messages";
import chatRoutes from "./chat";
import { authMiddleware } from "../../middlewares/authMiddleware";

const router = Router();

function buildSecureRoutes() {
  router.use(authMiddleware());
  router.use("/messages", messageRoutes);
  router.use("/chat", chatRoutes);

  return router;
}

export default buildSecureRoutes();
