import { create } from "./create";
import { remove } from "./remove";
import { update } from "./update";
import { getAllActiveUserChatsByUserId } from "./getAllActiveUserChatsByUserId";
import { addUserToChatByEmail } from "./addUserToChatByEmail";

export const chatController = {
  create,
  remove,
  update,
  getAllActiveUserChatsByUserId,
  addUserToChatByEmail,
};
