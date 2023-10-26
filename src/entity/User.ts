import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { Settings } from "./Settings";
import { Chat } from "./Chat";
import { IsEmail } from "class-validator";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "varchar",
    length: 150,
    unique: true,
  })
  @IsEmail()
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  nickname: string;

  @Column()
  phoneNumber: string;

  @Column({ nullable: true })
  avatar: string;

  @ManyToMany(() => Chat, (chat) => chat.users)
  @JoinTable()
  chats: Chat[];

  @OneToOne(() => Settings, (settings) => settings.user)
  @JoinColumn()
  settings: Settings;
}
