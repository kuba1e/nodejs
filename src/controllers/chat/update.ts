import { NextFunction, Response } from "express";
import { Chat } from "../../entity";
import { TypedRequest } from "../../types/request";
import { ChatRepository } from "../../models/chat";
import logger from "../../utils/logger";
import { transformChatResponse } from "../../utils/transformChatResponse";

export const update = async (
  req: TypedRequest<Chat>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { chatId } = req.params;
    const chatInfo = req.body;

    await ChatRepository.update({ id: chatId }, chatInfo);
    const updatedChat = await ChatRepository.findOne({
      where: {
        id: chatId as string,
      },
      relations: {
        users: true,
        userToChats: true,
      },
    });

    const transformedChat = transformChatResponse(updatedChat);

    res.success({ data: transformedChat });
    logger.info(`Successfully updated the chat with id: ${updatedChat.id}`);
  } catch (error) {
    const message = `Internal Server Error: ${error.message}`;
    logger.error(message);
    res.serverError(message);
  }
};
