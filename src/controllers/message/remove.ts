import { NextFunction, Request, Response } from "express";
import { MessageRepository } from "../../models/message";
import logger from "../../utils/logger";
import { Status } from "../../types/chat";
import { ChatRepository } from "../../models/chat";

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { messageId } = req.params;
    const userId = req.auth.id;

    const message = await MessageRepository.findOneBy({ id: messageId });

    if (!message) {
      const message = "Message does not exist.";
      res.badRequest(message);
      logger.error(message);
      return;
    }

    const chat = await ChatRepository.findOne({
      where: { id: message.chatId },
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
      const message = "Message cannot be removed from the removed chat.";
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

    await MessageRepository.update(
      { id: message.id },
      { status: Status.REMOVED }
    );

    const successMessage = `Successfully removed the message with id: ${messageId}`;
    res.success({ message: successMessage });
    logger.info(successMessage);
  } catch (error) {
    const message = `Internal Server Error: ${error.message}`;
    logger.error(message);
    res.serverError(message);
  }
};
