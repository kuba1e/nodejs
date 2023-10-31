import { TokenRepository } from "../../models/token";

export const remove = async (userId: string) => {
  try {
    const removedToken = await TokenRepository.delete({
      userId,
    });

    return removedToken;
  } catch (error) {
    throw new Error(error.message);
  }
};
