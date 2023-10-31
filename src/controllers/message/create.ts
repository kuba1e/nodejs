import { NextFunction, Response } from "express";
import { plainToClass } from "class-transformer";
import { Message } from "../../entity";
import { TypedRequest } from "../../types/request";
import { ChatRepository } from "../../models/chat";
import logger from "../../utils/logger";
import { MessageRepository } from "../../models/message";
import { MessageResponseDTO } from "../../dto/MessageResponseDTO";

export const create = async (
  req: TypedRequest<Pick<Message, "text" | "creatorId">>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { chatId } = req.params;
    const { text, creatorId } = req.body;

    const chat = await ChatRepository.findOne({
      where: { id: chatId },
    });
    const message = { text, creatorId, chatId: chat.id, readBy: [creatorId] };

    const savedMessage = await MessageRepository.save(message);

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
