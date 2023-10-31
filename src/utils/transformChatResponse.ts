import { ChatResponseDTO } from "../dto/ChatResponseDTO";
import { UserResponseDTO } from "../dto/UserResponseDTO";
import { Chat } from "../entity";
import { plainToClass } from "class-transformer";

export function transformChatResponse(chat: Chat) {
  const users = chat.users.map((user) => {
    const roleToChat = chat.userToChats.find(
      ({ userId }) => userId === user.id
    );

    const userResponseDto = plainToClass(UserResponseDTO, user);

    return {
      ...userResponseDto,
      userRole: roleToChat.userRole,
    };
  });

  const transformedChat = {
    ...chat,
    users,
  };

  return plainToClass(ChatResponseDTO, transformedChat);
}
