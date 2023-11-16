import { Router } from "express";
import userRoutes from "./authentication";

const router = Router();

function buildPublicRoutes() {
  router.use("/user", userRoutes);

  return router;
}

export default buildPublicRoutes();
