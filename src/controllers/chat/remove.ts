import { NextFunction, Request, Response } from "express";
import { ChatRepository } from "../../models/chat";
import logger from "../../utils/logger";
import { ChatOperations, Status } from "../../types/chat";
import { canUserManageChat } from "../../utils/chat/canUserManageChat";

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { chatId } = req.params;

    const userId = req.auth.id;

    const chat = await ChatRepository.findOneBy({ id: chatId });

    if (!chat) {
      const message = "Chat does not exist.";
      res.badRequest(message);
      logger.error(message);
      return;
    }

    if (
      !canUserManageChat({ userId, chat, operation: ChatOperations.REMOVE })
    ) {
      const message = "User does not have permission to remove chat.";
      res.forbidden(message);
      logger.error(message);
      return;
    }

    await ChatRepository.update({ id: chatId }, { status: Status.REMOVED });

    const successMessage = `Successfully removed the chat with id: ${chatId}`;
    res.success({ message: successMessage });
    logger.info(successMessage);
  } catch (error) {
    const message = `Internal Server Error: ${error.message}`;
    logger.error(message);
    res.serverError(message);
  }
};
