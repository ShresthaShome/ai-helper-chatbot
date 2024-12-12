import { gql } from "@apollo/client";

export const CREATE_CHATBOT = gql`
  mutation CreateChatbot($clerk_user_id: String!, $name: String!) {
    insertChatbots(clerk_user_id: $clerk_user_id, name: $name) {
      id
      name
    }
  }
`;

export const REMOVE_CHARACTERISTIC = gql`
  mutation RemoveCharacteristic($characteristic_id: Int!) {
    deleteChatbot_characteristics(id: $characteristic_id) {
      id
    }
  }
`;

export const DELETE_CHATBOT = gql`
  mutation DeleteChatbot($id: Int!) {
    deleteChatbots(id: $id) {
      id
      #Add more fields if want to return
    }
  }
`;

export const ADD_CHARACTERISTIC = gql`
  mutation AddCharacteristic($chatbotId: Int!, $content: String!) {
    insertChatbot_characteristics(chatbot_id: $chatbotId, content: $content) {
      id
      content
      created_at
    }
  }
`;

export const UPDATE_CHATBOT = gql`
  mutation UpdateChatbots($id: Int!, $name: String!) {
    updateChatbots(id: $id, name: $name) {
      id
      name
    }
  }
`;

export const INSERT_MESSAGE = gql`
  mutation InsertMessage(
    $chat_session_id: Int!
    $content: String!
    $sender: String!
  ) {
    insertMessages(
      chat_session_id: $chat_session_id
      content: $content
      sender: $sender
    ) {
      id
      chat_session_id
      content
      created_at
      sender
    }
  }
`;

export const INSERT_GUEST = gql`
  mutation InsertGuest($name: String!, $email: String!) {
    insertGuests(name: $name, email: $email) {
      id
      name
      email
    }
  }
`;

export const INSERT_CHAT_SESSION = gql`
  mutation InsertChatSession($guestId: Int!, $chatbotId: Int!) {
    insertChat_sessions(guest_id: $guestId, chatbot_id: $chatbotId) {
      id
    }
  }
`;
