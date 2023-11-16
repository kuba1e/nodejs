import { NextFunction, Response } from "express";
import { Chat } from "../../entity";
import { TypedRequest } from "../../types/request";
import { ChatRepository } from "../../models/chat";
import logger from "../../utils/logger";
import { transformChatResponse } from "../../utils/transformChatResponse";
import { canUserManageChat } from "../../utils/chat/canUserManageChat";
import { ChatOperations, Status } from "../../types/chat";

export const update = async (
  req: TypedRequest<Chat>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { chatId } = req.params;
    const chatInfo = req.body;
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
      res.badRequest("Chat does not exist.");
      logger.error(message);
      return;
    }

    const isChatRemoved = chat.status === Status.REMOVED;

    if (isChatRemoved) {
      const message = "Removed chat cannot be updated.";
      res.badRequest("Chat does not exist.");
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

    await ChatRepository.update({ id: chatId }, chatInfo);
    const updatedChat = await ChatRepository.getChatById(chatId);

    res.success({ data: updatedChat });
    logger.info(`Successfully updated the chat with id: ${updatedChat.id}`);
  } catch (error) {
    const message = `Internal Server Error: ${error.message}`;
    logger.error(message);
    res.serverError(message);
  }
};
