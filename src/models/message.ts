import { AppDataSource } from "../data-source";
import { Message } from "../entity";

export const MessageRepository = AppDataSource.getRepository(Message);
