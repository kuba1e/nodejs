import { NextFunction, Response } from "express";
import { TypedRequest } from "../../types/request";
import { Status } from "../../types/chat";
import { MessageRepository } from "../../models/message";
import logger from "../../utils/logger";
import { ChatRepository } from "../../models/chat";

export const getByChatId = async (
  req: TypedRequest<{}, { offset: string; pageSize: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { chatId } = req.params;
    const { offset = 0, pageSize = 20 } = req.query;
    const userId = req.auth.id;

    const chat = await ChatRepository.findOneBy({ id: chatId });

    if (!chat) {
      const message = "Chat does not exist.";
      res.badRequest(message);
      logger.error(message);
      return;
    }

    const isChatRemoved = chat.status === Status.REMOVED;

    if (isChatRemoved) {
      const message = "Messages cannot be read from the removed chat.";
      res.badRequest(message);
      logger.error(message);
      return;
    }

    const userJoinedChat = chat.users.find((user) => user.id === userId);

    if (!userJoinedChat) {
      const message = "User is not invited to the chat.";
      res.forbidden(message);
      logger.error(message);
      return;
    }

    const skip = Number(offset) * Number(pageSize);
    const take = Number(pageSize);

    const messages = await MessageRepository.find({
      where: {
        chatId,
        status: Status.ACTIVE,
      },
      order: {
        createdAt: "ASC",
      },
      skip,
      take,
      cache: true,
    });

    res.success({
      data: messages,
    });

    logger.info(`Successfully found messages for chat with id: ${chatId}`);
  } catch (error) {
    const message = `Internal Server Error: ${error.message}`;
    res.serverError(message);
    logger.error(message);
  }
};
