import client from "@/graphql/apolloClient";
import {
  INSERT_CHAT_SESSION,
  INSERT_GUEST,
  INSERT_MESSAGE,
} from "@/graphql/mutations/mutations";
import {
  InsertChatSessionResponse,
  InsertChatSessionVariables,
  InsertGuestResponse,
  InsertGuestVariables,
} from "@/types/types";

export default async function startNewChat(
  name: string,
  email: string,
  chatbotId: number
) {
  try {
    const guestResult = await client.mutate<
      InsertGuestResponse,
      InsertGuestVariables
    >({
      mutation: INSERT_GUEST,
      variables: {
        name,
        email,
      },
    });
    const guestId = guestResult.data?.insertGuests.id!;

    const chatSessionResult = await client.mutate<
      InsertChatSessionResponse,
      InsertChatSessionVariables
    >({
      mutation: INSERT_CHAT_SESSION,
      variables: {
        guestId,
        chatbotId,
      },
    });
    const chatSessionId = chatSessionResult.data?.insertChat_sessions.id!;

    await client.mutate({
      mutation: INSERT_MESSAGE,
      variables: {
        chat_session_id: chatSessionId,
        sender: "ai",
        content: `Hello ${name}!\nHow can I help you? 😎`,
      },
    });

    console.log("New Chat Session started successfully!");
    return chatSessionId;
  } catch (error) {
    console.error(error);
  }
}
