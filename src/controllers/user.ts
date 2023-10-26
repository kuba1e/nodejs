import { NextFunction, Response } from "express";
import { validate } from "class-validator";
import logger from "../utils/logger";
import { User } from "../entity/User";
import { AppDataSource } from "../data-source";
import { TypedRequest } from "../types/request";
import { Settings } from "../entity";
import { DEFAULT_CHAT_SETTINGS } from "../config/chatSettings";

const userRepository = AppDataSource.getRepository(User);
const settingsRepository = AppDataSource.getRepository(Settings);

export const registration = async (
  req: TypedRequest<Partial<User>>,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      email,
      nickname,
      password,
      firstName,
      lastName,
      phoneNumber,
      avatar,
    } = req.body;

    const settings = new Settings();
    settings.chatSetting = DEFAULT_CHAT_SETTINGS;

    await settingsRepository.save(settings);

    const user = new User();
    user.email = email;
    user.password = password;
    user.firstName = firstName;
    user.lastName = lastName;
    user.nickname = nickname;
    user.phoneNumber = phoneNumber;
    user.avatar = avatar;
    user.settings = settings;

    const errors = await validate(user);
    if (errors.length > 0) {
      throw new Error(`Validation failed!`);
    } else {
      userRepository
        .save(user)
        .then((createdUser) => {
          res.success({ data: createdUser });
          logger.info(`Successfully created user with id: ${createdUser.id}`);
        })
        .catch((error) => {
          const errorMessage = `Failed to create a user with provided nickname and password. Error: ${error.message}`;

          logger.error(errorMessage);
          res.badRequest(errorMessage);
        });
    }
  } catch (error) {
    const message = `Internal Server Error: ${error.message}`;
    logger.error(message);
    res.serverError(message);
  }
};

export const login = async (
  req: TypedRequest<Pick<User, "nickname" | "email">>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, nickname } = req.body;

    userRepository
      .findOne({
        where: {
          email,
          nickname,
        },
        relations: {
          settings: true,
          chats: true,
        },
      })
      .then((user) => {
        if (user) {
          res.success({
            data: user,
          });

          logger.info(`Successfully found user: ${user.email}`);
        } else {
          throw Error("Cannot find user");
        }
      })
      .catch((error) => {
        const errorMessage = `Failed to find user with provided data. Error: ${error.message}`;

        logger.error(errorMessage);
        res.badRequest(errorMessage);
      });
  } catch (error) {
    const message = `Internal Server Error: ${error.message}`;
    logger.error(message);
    res.serverError(message);
  }
};
