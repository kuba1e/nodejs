import { Chat, User } from "../../entity";

export function getUserRoleInChat(userId: User["id"], chat: Chat) {
  const userToChat = chat.userToChats.find((user) => user.userId === userId);

  return userToChat.userRole;
}
