import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Communications {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  userId: string;

  @Column({ nullable: true })
  webSocketId: string;

  @OneToOne(() => User, (user) => user.communications)
  @JoinColumn()
  user: User;
}
