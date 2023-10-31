import { NextFunction, Response } from "express";
import { TypedRequest } from "../../types/request";
import { Status } from "../../types/chat";
import { MessageRepository } from "../../models/message";
import logger from "../../utils/logger";

export const getByChatId = async (
  req: TypedRequest<{}, { offset: string; pageSize: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { chatId } = req.params;
    const { offset = 0, pageSize = 20 } = req.query;

    const skip = Number(offset) * Number(pageSize);
    const take = Number(pageSize);

    const messages = await MessageRepository.find({
      where: {
        chatId,
        status: Status.ACTIVE,
      },
      order: {
        createdAt: "ASC",
      },
      skip,
      take,
      cache: true,
    });

    res.success({
      data: messages,
    });

    logger.info(`Successfully found messages for chat with id: ${chatId}`);
  } catch (error) {
    const message = `Internal Server Error: ${error.message}`;
    res.serverError(message);
    logger.error(message);
  }
};
