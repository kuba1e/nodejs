import { NextFunction, Response } from "express";
import { Chat, User } from "../../entity";
import { TypedRequest } from "../../types/request";
import { ChatRepository } from "../../models/chat";
import logger from "../../utils/logger";
import { transformChatResponse } from "../../utils/transformChatResponse";
import { canUserManageChat } from "../../utils/chat/canUserManageChat";
import { ChatOperations, Status } from "../../types/chat";
import { UserRepository } from "../../models/user";
import { UserToChat } from "../../entity/UserToChat";
import { UserRole } from "../../types/user";
import { UserToChatRepository } from "../../models/userToChat";

export const addUserToChatByEmail = async (
  req: TypedRequest<{
    email: User["email"];
    chatId: Chat["id"];
  }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, chatId } = req.body;
    const userId = req.auth.id;

    const chat = await ChatRepository.findOne({
      where: { id: chatId },
      relations: {
        users: true,
        userToChats: true,
      },
    });

    if (!chat) {
      const message = "Chat does not exist.";
      res.badRequest(message);
      logger.error(message);
      return;
    }

    const userToAdd = await UserRepository.findOne({ where: { email } });

    if (!userToAdd) {
      const message = "User does not exist.";
      res.badRequest(message);
      logger.error(message);
      return;
    }

    const isChatRemoved = chat.status === Status.REMOVED;

    if (isChatRemoved) {
      const message = "Removed chat cannot be updated.";
      res.badRequest(message);
      logger.error(message);
      return;
    }

    if (
      !canUserManageChat({ userId, chat, operation: ChatOperations.UPDATE })
    ) {
      const message = "User does not have permission to update chat.";
      res.forbidden(message);
      logger.error(message);
      return;
    }

    const chatToUpdate = {
      ...chat,
      users: [...chat.users, userToAdd],
    };

    const userToChat = {
      userId: userToAdd.id,
      chatId: chat.id,
      userRole: UserRole.MEMBER,
    };

    await ChatRepository.save(chatToUpdate);

    await UserToChatRepository.save(userToChat);

    const updatedChat = await ChatRepository.getById(chatToUpdate.id);

    res.success({ data: updatedChat });
    logger.info(`Successfully updated the chat with id: ${updatedChat.id}`);
  } catch (error) {
    const message = `Internal Server Error: ${error.message}`;
    logger.error(message);
    res.serverError(message);
  }
};
