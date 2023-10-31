import messageRoutes from "./messages";
import chatRoutes from "./chat";

import { Router } from "express";
import { authCheck } from "../../middlewares/authCheck";

const router = Router();

function buildSecureRoutes() {
  router.use(authCheck);
  router.use("/messages", messageRoutes);
  router.use("/chat", chatRoutes);

  return router;
}

export default buildSecureRoutes();
