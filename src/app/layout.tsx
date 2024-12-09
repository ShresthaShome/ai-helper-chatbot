import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ApolloProviderWrapper from "@/components/ApolloProvider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Assistly AI Chatbot",
  description:
    "Created by BOSS Ullas Shome. Copyright © 2024. All rights reserved.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ApolloProviderWrapper>
      <ClerkProvider>
        <html lang="en">
          <body className="min-h-screen flex">
            {children}
            <Toaster position="bottom-center" />
          </body>
        </html>
      </ClerkProvider>
    </ApolloProviderWrapper>
  );
}
