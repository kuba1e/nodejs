import { NextFunction, Response } from "express";
import { Chat, User } from "../../entity";
import { TypedRequest } from "../../types/request";
import { UserRepository } from "../../models/user";
import { ChatRepository } from "../../models/chat";
import logger from "../../utils/logger";
import { UserRole } from "../../types/user";
import { UserToChatRepository } from "../../models/userToChat";
import { transformChatResponse } from "../../utils/transformChatResponse";
import { AppDataSource } from "../../data-source";
import { UserToChat } from "../../entity/UserToChat";

export const create = async (
  req: TypedRequest<
    Pick<Chat, "creatorId" | "title" | "type"> & {
      chatParticipants: Array<Chat["id"]>;
    }
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, type, chatParticipants } = req.body;

    const creatorId = req.auth.id;

    const user = await UserRepository.findOneBy({ id: creatorId });

    if (!user) {
      const message = "User does not exist.";
      res.badRequest(message);
      logger.error(message);
      return;
    }

    const users = await UserRepository.createQueryBuilder("user")
      .where("user.email IN (:...emails)", { emails: chatParticipants })
      .getMany();

    const chatUsers = [user, ...users];

    const chat = {
      creatorId: user.id,
      users: chatUsers,
      title,
      type,
    };

    const savedChat = await ChatRepository.save(chat);

    const queryRunner = AppDataSource.createQueryRunner();

    try {
      await queryRunner.connect();

      await queryRunner.startTransaction();

      for (const user of chatUsers) {
        const userToChat = new UserToChat();
        userToChat.userId = user.id;
        userToChat.chatId = savedChat.id;
        userToChat.userRole = UserRole.MEMBER;

        if (user.id === creatorId) {
          userToChat.userRole = UserRole.ADMIN;
        }

        await queryRunner.manager.save(userToChat);
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    const newChat = await ChatRepository.getById(savedChat.id);

    res.success({ data: newChat });
    logger.info(`Successfully created the chat with id: ${savedChat.id}`);
  } catch (error) {
    const message = `Internal Server Error: ${error.message}`;
    logger.error(message);
    res.serverError(message);
  }
};
