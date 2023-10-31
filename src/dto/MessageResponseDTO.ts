import { Expose, Exclude } from "class-transformer";
import { Chat } from "../entity";
import { Status } from "../types/chat";

export class MessageResponseDTO {
  @Expose()
  id: string;

  @Expose()
  text: string;

  @Expose()
  creatorId: string;

  @Expose()
  chatId: string;

  @Exclude()
  chat: Chat;

  @Expose()
  status: Status;

  @Expose()
  createdAt: Date;

  @Expose()
  modifiedAt: Date;

  @Expose()
  readBy: Array<string>;

  @Expose()
  referenceTo: string;

  @Expose()
  forwardedBy: string;
}
