import { NextFunction, Response } from "express";
import { TypedRequest } from "../../types/request";
import { Status } from "../../types/chat";
import { MessageRepository } from "../../models/message";
import logger from "../../utils/logger";
import { Message } from "../../entity";
import { ChatRepository } from "../../models/chat";

export const forward = async (
  req: TypedRequest<Pick<Message, "referenceTo" | "forwardedBy">>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { messageId, chatId } = req.params;

    const { referenceTo, forwardedBy } = req.body;

    if (!referenceTo || !forwardedBy) {
      res.badRequest(
        `Required data was not provided: referenceTo, forwardedBy`
      );
    }

    const chat = await ChatRepository.findOneBy({ id: chatId });
    const messageToForward = await MessageRepository.findOneBy({
      id: messageId,
    });

    const message = {
      text: messageToForward.text,
      creatorId: messageToForward.creatorId,
      status: Status.ACTIVE,
      chatId: chat.id,
      readBy: [],
      referenceTo: referenceTo,
      forwardedBy: forwardedBy,
    };

    const forwardedMessage = MessageRepository.save(message);

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
