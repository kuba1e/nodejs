import { NextFunction, Response } from "express";
import { TypedRequest } from "../../types/request";
import { Status } from "../../types/chat";
import { MessageRepository } from "../../models/message";
import logger from "../../utils/logger";
import { Message } from "../../entity";
import { ChatRepository } from "../../models/chat";

export const forward = async (
  req: TypedRequest<Pick<Message, "forwardedBy">>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { messageId, chatId } = req.params;
    const forwardedBy = req.auth.id;

    if (!forwardedBy) {
      res.badRequest(`Required data was not provided: forwardedBy`);
      return;
    }

    const chat = await ChatRepository.findOne({
      where: { id: chatId },
      relations: {
        userToChats: true,
        users: true,
      },
    });

    if (!chat) {
      const message = "Chat does not exist.";
      res.badRequest(message);
      logger.error(message);
      return;
    }

    const isChatRemoved = chat.status === Status.REMOVED;

    if (isChatRemoved) {
      const message = "Message cannot be forwarded to the removed chat.";
      res.badRequest(message);
      logger.error(message);
      return;
    }

    const userJoinedChat = chat.users.find((user) => user.id === forwardedBy);

    if (!userJoinedChat) {
      const message = "User is not invited to the chat.";
      res.forbidden(message);
      logger.error(message);
      return;
    }

    const messageToForward = await MessageRepository.findOneBy({
      id: messageId,
    });

    const message = {
      text: messageToForward.text,
      creatorId: messageToForward.creatorId,
      status: Status.ACTIVE,
      chatId: chat.id,
      readBy: [forwardedBy],
      referenceTo: messageToForward.chatId,
      forwardedBy: forwardedBy,
    };

    const forwardedMessage = await MessageRepository.save(message);

    res.success({
      data: forwardedMessage,
    });

    logger.info(`Successfully forwarded message for chat with id: ${chatId}`);
  } catch (error) {
    const message = `Internal Server Error: ${error.message}`;
    logger.error(message);
    res.serverError(message);
  }
};
