import jwt from "jsonwebtoken";
import { User } from "../../entity";

const jwtAccessSecretKey = process.env.ACCESS_SECRET_KEY;
const jwtRefreshSecretKey = process.env.REFRESH_SECRET_KEY;

export const generate = (payload: Partial<User>) => {
  const accessToken = jwt.sign(payload, jwtAccessSecretKey, {
    expiresIn: "60s",
  });

  const refreshToken = jwt.sign(payload, jwtRefreshSecretKey, {
    expiresIn: "30d",
  });

  return {
    accessToken,
    refreshToken,
  };
};
