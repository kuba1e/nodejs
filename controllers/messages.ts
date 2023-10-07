import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";

export const getMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.success({
      data: [],
      message: "Successfully get messages.",
    });
    logger.info("Messages have been successfully sent");
  } catch (error) {
    const message = `Internal Server Error: ${error.message}`;
    res.serverError(message);
    logger.error(message);
  }
};

export const createMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.success({ message: "Successfully created message." });
    logger.info(
      `Messages has been successfully created. Message Id: ${Date.now()}`
    );
  } catch (error) {
    const message = `Internal Server Error: ${error.message}`;
    logger.error(message);
    res.serverError(message);
  }
};

export const updateMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    res.success({ message: `Successfully updated message with id: ${id}` });
    logger.info(
      `Messages has been successfully updated. Message Id: ${Date.now()}`
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
    const { id } = req.params;

    res.success({ message: `Successfully deleted message with id: ${id}` });
    logger.info(
      `Messages has been successfully deleted. Message Id: ${Date.now()}`
    );
  } catch (error) {
    const message = `Internal Server Error: ${error.message}`;
    logger.error(message);
    res.serverError(message);
  }
};
