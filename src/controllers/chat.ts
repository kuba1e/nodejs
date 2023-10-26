import { NextFunction, Request, Response } from "express";
import { Chat, User } from "../entity";
import logger from "../utils/logger";
import { AppDataSource } from "../data-source";
import { Status } from "../types/chat";
import { TypedRequest } from "../types/request";

const chatRepository = AppDataSource.getRepository(Chat);
const userRepository = AppDataSource.getRepository(User);

export const createChat = async (
  req: TypedRequest<Pick<Chat, "creatorId" | "title" | "type">>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { creatorId, title, type } = req.body;

    const user = await userRepository.findOneBy({ id: creatorId });

    const chat = new Chat();
    chat.creatorId = user.id;
    chat.users = [user];
    chat.title = title;
    chat.type = type;

    chatRepository
      .save(chat)
      .then((savedChat) => {
        res.success({ data: savedChat });
        logger.info(`Successfully created the chat with id: ${savedChat.id}`);
      })
      .catch((error) => {
        const errorMessage = `Failed to create the chat with provided data. Error: ${error.message}`;

        logger.error(errorMessage);
        res.badRequest(errorMessage);
      });
  } catch (error) {
    const message = `Internal Server Error: ${error.message}`;
    logger.error(message);
    res.serverError(message);
  }
};

export const updateChat = async (
  req: TypedRequest<Chat>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { chatId } = req.params;
    const chatInfo = req.body;

    chatRepository.update({ id: chatId }, chatInfo).catch((error) => {
      const errorMessage = `Failed to update the chat with provided data. Error: ${error.message}`;

      logger.error(errorMessage);
      res.badRequest(errorMessage);
    });

    const updatedChat = await chatRepository.findOneBy({
      id: chatId as string,
    });
    res.success({ data: updatedChat });
    logger.info(`Successfully updated the chat with id: ${updatedChat.id}`);
  } catch (error) {
    const message = `Internal Server Error: ${error.message}`;
    logger.error(message);
    res.serverError(message);
  }
};

export const deleteChat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { chatId } = req.params;

    chatRepository
      .update({ id: chatId }, { status: Status.REMOVED })
      .then(() => {
        const successMessage = `Successfully removed the chat with id: ${chatId}`;
        res.success({ message: successMessage });
        logger.info(successMessage);
      })
      .catch((error) => {
        const errorMessage = `Failed to delete the chat with provided data. Error: ${error.message}`;

        logger.error(errorMessage);
        res.badRequest(errorMessage);
      });
  } catch (error) {
    const message = `Internal Server Error: ${error.message}`;
    logger.error(message);
    res.serverError(message);
  }
};
