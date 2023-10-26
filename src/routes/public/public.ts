import { Router } from "express";
import userRoutes from "./user";

const router = Router();

function buildPublicRoutes() {
  router.use("/user", userRoutes);

  return router;
}

export default buildPublicRoutes();
