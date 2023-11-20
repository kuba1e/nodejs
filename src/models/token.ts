import { AppDataSource } from "../data-source";
import { Token } from "../entity";

export const TokenRepository = AppDataSource.getRepository(Token);
