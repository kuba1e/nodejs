import { AppDataSource } from "../data-source";
import { Chat } from "../entity";

export const ChatRepository = AppDataSource.getRepository(Chat);
