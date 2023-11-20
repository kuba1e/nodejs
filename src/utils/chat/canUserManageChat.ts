import { USER_ROLE_TO_CHAT_PERMISSION_MAP } from "../../config/chat";
import { Chat, User } from "../../entity";
import { ChatOperations } from "../../types/chat";
import { getUserRoleInChat } from "./getUserRoleInChat";

export function canUserManageChat({
  userId,
  chat,
  operation,
}: {
  userId: User["id"];
  chat: Chat;
  operation: ChatOperations;
}) {
  const isUserCreator = chat.creatorId === userId;

  const userRoleInChat = getUserRoleInChat(userId, chat);

  const allowedOperations = USER_ROLE_TO_CHAT_PERMISSION_MAP[userRoleInChat];

  const userHasPermission = allowedOperations.includes(operation);

  return isUserCreator || userHasPermission;
}
