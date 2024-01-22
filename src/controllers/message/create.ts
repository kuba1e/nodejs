import { NextFunction, Response } from "express";
import { Message } from "../../entity";
import { TypedRequest } from "../../types/request";
import { ChatRepository } from "../../models/chat";
import logger from "../../utils/logger";
import { MessageRepository } from "../../models/message";
import { Status } from "../../types/chat";
import { sendMessageToQueue } from "../../services/sqs";
import { SQS_MESSAGE_TYPE } from "../../types/sqs";

export const create = async (
  req: TypedRequest<Pick<Message, "text" | "creatorId">>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { chatId } = req.params;
    const { text } = req.body;
    const userId = req.auth.id;

    const chat = await ChatRepository.findOne({
      where: { id: chatId },
      relations: { users: true },
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
      res.badRequest("Chat does not exist.");
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

    const message = {
      text,
      creatorId: userId,
      chatId: chat.id,
      readBy: [userId],
    };

    const savedMessage = await MessageRepository.save(message);

    const queueMessage = {
      type: SQS_MESSAGE_TYPE.NEW_MESSAGE,
      payload: savedMessage,
    };

    sendMessageToQueue(JSON.stringify(queueMessage));

    res.success({
      data: savedMessage,
    });

    logger.info(`Successfully saved message for chat with id: ${chatId}`);
  } catch (error) {
    const message = `Internal Server Error: ${error.message}`;
    logger.error(message);
    res.serverError(message);
  }
};
