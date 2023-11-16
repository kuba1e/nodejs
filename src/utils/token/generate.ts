import jwt from "jsonwebtoken";
import { TokenPayload } from "../../types/token";

const jwtAccessSecretKey = process.env.ACCESS_SECRET_KEY;
const jwtRefreshSecretKey = process.env.REFRESH_SECRET_KEY;

export const generate = (payload: TokenPayload) => {
  const accessToken = jwt.sign(payload, jwtAccessSecretKey, {
    expiresIn: "2d",
  });

  const refreshToken = jwt.sign(payload, jwtRefreshSecretKey, {
    expiresIn: "30d",
  });

  return {
    accessToken,
    refreshToken,
  };
};
