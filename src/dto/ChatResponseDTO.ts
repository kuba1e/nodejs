import { Expose, Exclude, Type } from "class-transformer";
import { Message } from "../entity";
import { UserToChat } from "../entity/UserToChat";
import { ChatType, Status } from "../types/chat";
import { ChatUser } from "../types/user";

export class ChatResponseDTO {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  creatorId: string;

  @Expose()
  users: ChatUser[];

  @Expose()
  status: Status;

  @Expose()
  type: ChatType;

  @Expose()
  createdAt: Date;

  @Exclude()
  modifiedAt: Date;

  @Expose()
  icon: string;

  @Type(() => Message)
  messages: Message[];

  @Exclude()
  userToChats: Array<UserToChat>;
}
