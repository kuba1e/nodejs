import { AppDataSource } from "../data-source";
import { Chat, User } from "../entity";
import { ChatResponse, Status } from "../types/chat";
import { transformChatResponse } from "../utils/transformChatResponse";

type CustomRepo = {
  getById: (id: Chat["id"]) => Promise<ChatResponse>;
  getAllActiveByUserId: (userId: User["id"]) => Promise<ChatResponse[]>;
};

export const ChatRepository = AppDataSource.getRepository(
  Chat
).extend<CustomRepo>({
  async getById(id) {
    const chat = await this.findOne({
      where: {
        id,
      },
      relations: {
        users: true,
        userToChats: true,
      },
    });

    return transformChatResponse(chat);
  },
  async getAllActiveByUserId(userId: string) {
    const chats = await this.createQueryBuilder("chat")
      .where("chat.status = :chatStatus", { chatStatus: Status.ACTIVE })
      .innerJoinAndSelect("chat.userToChats", "userToChats")
      .innerJoinAndSelect("chat.users", "user", "user.id = :userId", {
        userId,
      })
      .getMany();

    return chats?.map((chat) => transformChatResponse(chat));
  },
});
