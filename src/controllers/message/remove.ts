import { NextFunction, Request, Response } from "express";
import { MessageRepository } from "../../models/message";
import logger from "../../utils/logger";
import { Status } from "../../types/chat";

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { messageId } = req.params;

    await MessageRepository.update(
      { id: messageId },
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
