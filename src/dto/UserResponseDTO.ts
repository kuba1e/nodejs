import { Expose, Exclude } from "class-transformer";
import { Chat, Settings, Token } from "../entity";
import { UserToChat } from "../entity/UserToChat";

export class UserResponseDTO {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Exclude()
  password: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Expose()
  nickname: string;

  @Expose()
  phoneNumber: string;

  @Expose()
  avatar: string;

  @Exclude()
  chats: Chat[];

  @Expose()
  settings: Settings;

  @Exclude()
  token: Token;

  @Exclude()
  userToChats: Array<UserToChat>;
}
