import messageRoutes from "./messages";

import { Router } from "express";

const router = Router();

function buildSecureRoutes() {
  router.use("/messages", messageRoutes);

  return router;
}

export default buildSecureRoutes();
