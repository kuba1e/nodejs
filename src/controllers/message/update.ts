import { NextFunction, Response } from "express";
import { Message } from "../../entity";
import { TypedRequest } from "../../types/request";
import { MessageRepository } from "../../models/message";
import logger from "../../utils/logger";

export const update = async (
  req: TypedRequest<Partial<Message>>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { messageId } = req.params;

    const message = req.body;

    await MessageRepository.update({ id: messageId }, message);

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
