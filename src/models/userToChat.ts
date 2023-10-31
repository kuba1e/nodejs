import { AppDataSource } from "../data-source";
import { UserToChat } from "../entity/UserToChat";

export const UserToChatRepository = AppDataSource.getRepository(UserToChat);
