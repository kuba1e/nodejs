import { TokenRepository } from "../../models/token";

export const save = async (userId: string, token: string) => {
  try {
    const tokenData = await TokenRepository.upsert(
      { refreshToken: token, userId },
      ["userId"]
    );

    return tokenData;
  } catch (error) {
    throw new Error(error.message);
  }
};
