import { AppDataSource } from "../data-source";
import { User } from "../entity";
import { excludeColumns } from "../utils/entity";
import { transformChatResponse } from "../utils/transformChatResponse";

export const UserRepository = AppDataSource.getRepository(User).extend({
  getUserByEmail(email: string) {
    return this.findOne({
      where: {
        email,
      },
      relations: {
        settings: true,
      },
    });
  },
  getExtendedUserByEmail(email: string) {
    return this.createQueryBuilder("user")
      .where("user.email = :email", { email })
      .addSelect("user.password")
      .getOne();
  },
  async getAllActiveUserChats(userId: string) {
    const user = await this.findOne({
      relations: {
        chats: {
          users: true,
          userToChats: true,
        },
      },
      where: {
        id: userId,
      },
    });
    return user.chats?.map((chat) => transformChatResponse(chat));
  },
});
