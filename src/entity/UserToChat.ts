import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Chat } from "./Chat";
import { UserRole } from "../types/user";
import { User } from "./User";

@Entity()
export class UserToChat {
  @PrimaryGeneratedColumn()
  useToChatId: string;

  @Column()
  userId: string;

  @Column()
  chatId: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.MEMBER,
  })
  userRole: UserRole;

  @ManyToOne(() => User, (user) => user.userToChats)
  user: User;

  @ManyToOne(() => Chat, (chat) => chat.userToChats)
  chat: Chat;
}
