import messageRoutes from "./messages";
import chatRoutes from "./chat";

import { Router } from "express";

const router = Router();

function buildSecureRoutes() {
  router.use("/messages", messageRoutes);
  router.use("/chat", chatRoutes);

  return router;
}

export default buildSecureRoutes();
