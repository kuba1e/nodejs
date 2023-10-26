import { NextFunction, Request, Response } from "express";
import { Chat, Message } from "../entity";
import logger from "../utils/logger";
import { AppDataSource } from "../data-source";
import { Status } from "../types/chat";
import { TypedRequest } from "../types/request";

const chatRepository = AppDataSource.getRepository(Chat);
const messageRepository = AppDataSource.getRepository(Message);

export const getMessages = async (
  req: TypedRequest<{}, { offset: string; pageSize: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { chatId } = req.params;
    const { offset = 0, pageSize = 20 } = req.query;

    const skip = Number(offset) * Number(pageSize);
    const take = Number(pageSize);

    messageRepository
      .find({
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
      })
      .then((messages) => {
        res.success({
          data: messages,
        });

        logger.info(`Successfully found messages for chat with id: ${chatId}`);
      })
      .catch((error) => {
        const errorMessage = `Failed to find messages. Error: ${error.message}`;
        logger.error(errorMessage);
        res.badRequest(errorMessage);
      });
  } catch (error) {
    const message = `Internal Server Error: ${error.message}`;
    res.serverError(message);
    logger.error(message);
  }
};

export const createMessage = async (
  req: TypedRequest<Pick<Message, "text" | "creatorId">>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { chatId } = req.params;
    const { text, creatorId } = req.body;

    const chat = await chatRepository.findOneBy({ id: chatId });
    const message = new Message();

    message.text = text;
    message.creatorId = creatorId;
    message.chat = chat;
    message.readBy = [];

    messageRepository
      .save(message)
      .then((message) => {
        res.success({
          data: message,
        });

        logger.info(`Successfully saved message for chat with id: ${chatId}`);
      })
      .catch((error) => {
        const errorMessage = `Failed to save messages. Error: ${error.message}`;
        logger.error(errorMessage);
        res.badRequest(errorMessage);
      });
  } catch (error) {
    const message = `Internal Server Error: ${error.message}`;
    logger.error(message);
    res.serverError(message);
  }
};

export const updateMessage = async (
  req: TypedRequest<Partial<Message>>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { messageId } = req.params;

    const message = req.body;

    messageRepository.update({ id: messageId }, message).catch((error) => {
      const errorMessage = `Failed to update the message with provided data. Error: ${error.message}`;
      logger.error(errorMessage);
      res.badRequest(errorMessage);
    });

    const updatedMessage = await messageRepository.findOneBy({
      id: messageId,
    });
    res.success({ data: "updatedMessage" });
    logger.info(
      `Successfully updated the message with id: ${updatedMessage.id}`
    );
  } catch (error) {
    const message = `Internal Server Error: ${error.message}`;
    logger.error(message);
    res.serverError(message);
  }
};

export const deleteMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { messageId } = req.params;

    messageRepository
      .update({ id: messageId }, { status: Status.REMOVED })
      .then(() => {
        const successMessage = `Successfully removed the message with id: ${messageId}`;
        res.success({ message: successMessage });
        logger.info(successMessage);
      })
      .catch((error) => {
        const errorMessage = `Failed to delete the message with provided data. Error: ${error.message}`;
        logger.error(errorMessage);
        res.badRequest(errorMessage);
      });
  } catch (error) {
    const message = `Internal Server Error: ${error.message}`;
    logger.error(message);
    res.serverError(message);
  }
};

export const forwardMessage = async (
  req: TypedRequest<Pick<Message, "referenceTo" | "forwardedBy">>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { messageId, chatId } = req.params;

    const { referenceTo, forwardedBy } = req.body;

    if (!referenceTo || !forwardedBy) {
      res.badRequest(
        `Required data was not provided: referenceTo, forwardedBy`
      );
    }

    const chat = await chatRepository.findOneBy({ id: chatId });
    const messageToForward = await messageRepository.findOneBy({
      id: messageId,
    });

    const message = new Message();

    message.text = messageToForward.text;
    message.creatorId = messageToForward.creatorId;
    message.status = Status.ACTIVE;
    message.chat = chat;
    message.referenceTo = referenceTo;
    message.forwardedBy = forwardedBy;

    messageRepository
      .save(message)
      .then((message) => {
        res.success({
          data: message,
        });

        logger.info(
          `Successfully forwarded message for chat with id: ${chatId}`
        );
      })
      .catch((error) => {
        const errorMessage = `Failed to forward messages. Error: ${error.message}`;
        logger.error(errorMessage);
        res.badRequest(errorMessage);
      });
  } catch (error) {
    const message = `Internal Server Error: ${error.message}`;
    logger.error(message);
    res.serverError(message);
  }
};
