import { Router } from "express";
import userRoutes from "./authentication";

const router = Router();

function buildPublicRoutes() {
  router.use("/auth", userRoutes);

  return router;
}

export default buildPublicRoutes();
