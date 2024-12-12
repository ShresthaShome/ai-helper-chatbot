export interface Chatbot {
  id: number;
  clerk_user_id: string;
  name: string;
  created_at: string;
  chatbot_characteristics: ChatbotCharacteristic[];
  chat_sessions: ChatSession[];
}

export interface ChatbotCharacteristic {
  id: number;
  chatbot_id: number;
  content: string;
  created_at: string;
}

export interface Guest {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface ChatSession {
  id: number;
  chatbot_id: number;
  guest_id: number | null;
  created_at: string;
  messages: Message[];
  guest: Guest;
}

export interface Message {
  id: number;
  chat_session_id: number;
  content: string;
  created_at: string;
  sender: "ai" | "user";
}

export interface GetChatbotByIdResponse {
  chatbots: Chatbot;
}

export interface GetChatbotByIdVariables {
  id: number;
}

export interface GetChatbotsByUserData {
  chatbots_by_user: Chatbot[];
}
export interface GetChatbotsByUserDataVariables {
  clerk_user_id: string;
}
export interface GetUserChatbotsResponse {
  chatbots_by_user: Chatbot[];
}
export interface GetUserChatbotsVariables {
  userId: string;
}

export interface GetChatSessionMessagesResponse {
  chat_sessions: {
    id: number;
    messages: Message[];
    created_at: string;
    chatbots: {
      name: string;
    };
    guests: {
      name: string;
      email: string;
    };
  };
}

export interface GetChatSessionMessagesVariables {
  id: number;
}

export interface InsertGuestResponse {
  insertGuests: Guest;
}

export interface InsertGuestVariables {
  name: string;
  email: string;
}

export interface InsertChatSessionResponse {
  insertChat_sessions: ChatSession;
}

export interface InsertChatSessionVariables {
  guestId: number;
  chatbotId: number;
}

export interface GetMessagesByChatSessionIdResponse {
  chat_sessions: {
    id: number;
    messages: Message[];
  };
}

export interface GetMessagesByChatSessionIdVariables {
  chatSessionId: number;
}
