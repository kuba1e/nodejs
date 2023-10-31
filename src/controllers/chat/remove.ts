import { NextFunction, Request, Response } from "express";
import { ChatRepository } from "../../models/chat";
import logger from "../../utils/logger";
import { Status } from "../../types/chat";

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { chatId } = req.params;

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
