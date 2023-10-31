import { Response } from "express";
import { TokenRepository } from "../../models/token";

export const findToken = async (refreshToken: string, response: Response) => {
  try {
    const tokenData = await TokenRepository.findOneBy({ refreshToken });

    return tokenData;
  } catch (error) {
    throw new Error(error.message);
  }
};
