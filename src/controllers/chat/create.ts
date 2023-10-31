import { NextFunction, Response } from "express";
import { Chat } from "../../entity";
import { TypedRequest } from "../../types/request";
import { UserRepository } from "../../models/user";
import { ChatRepository } from "../../models/chat";
import logger from "../../utils/logger";
import { UserRole } from "../../types/user";
import { UserToChatRepository } from "../../models/userToChat";
import { transformChatResponse } from "../../utils/transformChatResponse";

export const create = async (
  req: TypedRequest<Pick<Chat, "creatorId" | "title" | "type">>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { creatorId, title, type } = req.body;

    const user = await UserRepository.findOneBy({ id: creatorId });

    const chat = {
      creatorId: user.id,
      users: [user],
      title,
      type,
    };

    const savedChat = await ChatRepository.save(chat);

    const userToChat = {
      userId: user.id,
      chatId: savedChat.id,
      userRole: UserRole.ADMIN,
    };

    await UserToChatRepository.save(userToChat);

    const newChat = await ChatRepository.findOne({
      where: {
        id: savedChat.id,
      },
      relations: {
        users: true,
        userToChats: true,
      },
    });

    const transformedChat = transformChatResponse(newChat);

    res.success({ data: transformedChat });
    logger.info(`Successfully created the chat with id: ${savedChat.id}`);
  } catch (error) {
    const message = `Internal Server Error: ${error.message}`;
    logger.error(message);
    res.serverError(message);
  }
};
