"use client";

import { Message } from "@/types/types";
import { usePathname } from "next/navigation";
import Avatar from "./Avatar";
import { UserCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useEffect, useRef } from "react";

export default function Messages({
  messages,
  chatbotName,
}: {
  messages: Message[];
  chatbotName: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const path = usePathname();
  const isReviewsPage = path.includes("review-sessions");

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div
      className="flex-1 flex flex-col overflow-y-auto space-y-10
    py-10 px-5 bg-white rounded-lg"
    >
      {messages.map((message) => {
        const isSender = message.sender !== "user";

        return (
          <div
            key={message.id}
            className={`chat ${isSender ? "chat-start" : "chat-end"} relative`}
          >
            {isReviewsPage && (
              <p className="text-xs text-gray-500 mx-1 absolute -bottom-5 hover:text-gray-700">
                sent {new Date(message.created_at).toLocaleString()}
              </p>
            )}

            <div className={`chat-image avatar w-10 ${!isSender && "-mr-4"}`}>
              {isSender ? (
                <Avatar
                  seed={chatbotName}
                  className="h-12 w-12 bg-white rounded-full border-2 border-[#2991ee]"
                />
              ) : (
                <UserCircle className="text-[#2991ee]" />
              )}
            </div>

            <article
              className={`chat-bubble text-white ${
                isSender
                  ? "chat-bubble-primary bg-[#2991ee]"
                  : "chat-bubble-secondary bg-gray-200 text-gray-700"
              }`}
            >
              <ReactMarkdown
                rehypePlugins={[remarkGfm]}
                className={`break-words`}
                components={{
                  ul: ({ node, ...props }) => (
                    <ul
                      {...props}
                      className="list-disc list-inside ml-5 mb-5"
                    />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol
                      {...props}
                      className="list-decimal list-inside ml-5 mb-5"
                    />
                  ),
                  h1: ({ node, ...props }) => (
                    <h1 {...props} className="text-2xl font-bold mb-5" />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2 {...props} className="text-xl font-bold mb-5" />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 {...props} className="text-lg font-bold mb-5" />
                  ),
                  table: ({ node, ...props }) => (
                    <table
                      {...props}
                      className="table-auto w-full border-separate border-2 rounded-sm border-spacing-4 border-white mb-5"
                    />
                  ),
                  th: ({ node, ...props }) => (
                    <th {...props} className="text-left underline" />
                  ),
                  p: ({ node, ...props }) => (
                    <p
                      {...props}
                      className={`whitespace-break-spaces mb-5 ${
                        message.content === "Thinking..." && "animate-pulse"
                      } ${isSender ? "text-white" : "text-gray-700"}`}
                    />
                  ),
                  a: ({ node, ...props }) => (
                    <a
                      {...props}
                      className="font-bold underline hover:text-blue-400"
                      rel="noopener noreferrer"
                    />
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </article>
          </div>
        );
      })}

      <div ref={ref} />
    </div>
  );
}
