import { NextFunction, Response } from "express";
import { Message } from "../../entity";
import { TypedRequest } from "../../types/request";
import { MessageRepository } from "../../models/message";
import logger from "../../utils/logger";
import { ChatRepository } from "../../models/chat";
import { Status } from "../../types/chat";

export const update = async (
  req: TypedRequest<Partial<Message>>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { messageId } = req.params;
    const messageToUpdate = req.body;
    console.log(messageToUpdate);
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
      const message = "Message cannot be updated in the removed chat.";
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

    await MessageRepository.update({ id: messageId }, messageToUpdate);

    const updatedMessage = await MessageRepository.findOneBy({
      id: messageId,
    });
    res.success({ data: updatedMessage });
    logger.info(
      `Successfully updated the message with id: ${updatedMessage.id}`
    );
  } catch (error) {
    const message = `Internal Server Error: ${error.message}`;
    logger.error(message);
    res.serverError(message);
  }
};
