import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Message } from "./Message";
import { User } from "./User";
import { Status, ChatType } from "../types/chat";
import { UserRole } from "../types/user";
import { UserToChat } from "./UserToChat";

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: string;

  @Column("text")
  title: string;

  @Column()
  creatorId: string;

  @ManyToMany(() => User, (user) => user.chats)
  users: Array<User>;

  @Column({
    type: "enum",
    enum: Status,
    default: Status.ACTIVE,
  })
  status: Status;

  @Column()
  type: ChatType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  modifiedAt: Date;

  @Column({ nullable: true })
  icon: string;

  @OneToMany(() => Message, (message) => message.chatId)
  messages: Message[];

  @OneToMany(() => UserToChat, (userToChat) => userToChat.chat)
  userToChats: Array<UserToChat>;
}
