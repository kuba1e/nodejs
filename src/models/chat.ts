import { AppDataSource } from "../data-source";
import { Chat } from "../entity";
import { transformChatResponse } from "../utils/transformChatResponse";

export const ChatRepository = AppDataSource.getRepository(Chat).extend({
  async getChatById(id: Chat["id"]) {
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
});
