import { expressjwt as jwt } from "express-jwt";

const jwtAccessSecretKey = process.env.ACCESS_SECRET_KEY;

export function authMiddleware() {
  return jwt({
    secret: jwtAccessSecretKey,
    algorithms: ["HS256"],
  });
}
