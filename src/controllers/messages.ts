import { NextFunction, Request, Response } from "express";

export const getMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.send("Successfully get messages.");
  } catch (error) {
    next(error);
  }
};

export const createMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const message = req.body;

    res.send("Successfully created message.");
  } catch (error) {
    next(error);
  }
};

export const updateMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    res.send(`Successfully updated message with id: ${id}`);
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    res.send(`Successfully deleted message with id: ${id}`);
  } catch (error) {
    next(error);
  }
};
