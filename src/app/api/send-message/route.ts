import { INSERT_MESSAGE } from "@/graphql/mutations/mutations";
import {
  GET_CHATBOT_BY_ID,
  GET_MESSAGES_BY_CHAT_SESSION_ID,
} from "@/graphql/queries/queries";
import { serverClient } from "@/lib/server/serverClient";
import {
  GetChatbotByIdResponse,
  GetMessagesByChatSessionIdResponse,
  GetMessagesByChatSessionIdVariables,
} from "@/types/types";
import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { chat_session_id, chatbot_id, content, name } = await req.json();

  console.log(
    `Received message from ${name}: ${content} in chat session ${chat_session_id} (chatbot ${chatbot_id})`
  );

  try {
    const { data } = await serverClient.query<GetChatbotByIdResponse>({
      query: GET_CHATBOT_BY_ID,
      variables: { id: chatbot_id },
    });

    const chatbot = data.chatbots;

    if (!chatbot) {
      return NextResponse.json({ error: "Chatbot not found" }, { status: 404 });
    }

    const { data: messageData } = await serverClient.query<
      GetMessagesByChatSessionIdResponse,
      GetMessagesByChatSessionIdVariables
    >({
      query: GET_MESSAGES_BY_CHAT_SESSION_ID,
      variables: { chatSessionId: chat_session_id },
      fetchPolicy: "no-cache",
    });

    const prevMessages = messageData.chat_sessions.messages;

    const formattedPrevMessages: ChatCompletionMessageParam[] =
      prevMessages.map((message) => ({
        role: message.sender === "ai" ? "system" : "user",
        name: message.sender === "ai" ? "system" : name,
        content: message.content,
      }));

    const systemPrompt = chatbot.chatbot_characteristics
      .map((c) => c.content)
      .join(" + ");

    console.log(systemPrompt);

    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        name: "system",
        content: `You are a heleful assistant talking to ${name}. If a generic question is asked which is not
            relevant or in same scope or domain as points in mentioned in the key info section, kindly
            inform the user they're only allowed to search for the specified content. Use emoji's where possible.
            Here are some key info that you need to be aware of, these are elements you may be asked about: ${systemPrompt}.`,
      },
      ...formattedPrevMessages,
      {
        role: "user",
        name,
        content: content,
      },
    ];

    const onenaiResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
    });

    const aiResponse = onenaiResponse?.choices?.[0].message?.content?.trim();

    if (!aiResponse) {
      return NextResponse.json(
        { error: "AI response not found" },
        { status: 500 }
      );
    }

    const aiMessageResponse = await serverClient.mutate({
      mutation: INSERT_MESSAGE,
      variables: {
        chat_session_id,
        sender: "ai",
        content: aiResponse,
      },
    });

    return NextResponse.json({
      id: aiMessageResponse.data.insertMessages.id, //Date.now(),
      content: "aiResponse",
    });
  } catch (error) {
    console.error("Error sending message", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
