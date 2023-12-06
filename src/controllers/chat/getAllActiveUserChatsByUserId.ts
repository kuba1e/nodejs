import { NextFunction, Response, Request } from "express";
import { Chat } from "../../entity";
import { TypedRequest } from "../../types/request";
import { UserRepository } from "../../models/user";
import { ChatRepository } from "../../models/chat";
import logger from "../../utils/logger";

export const getAllActiveUserChatsByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.auth.id;

    const chats = await UserRepository.getAllActiveUserChats(userId);
    res.success({ data: chats });
    logger.info(`Successfully found chats for user with id: ${userId}`);
  } catch (error) {
    const message = `Internal Server Error: ${error.message}`;
    logger.error(message);
    res.serverError(message);
  }
};
