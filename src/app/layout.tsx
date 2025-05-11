import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ApolloProviderWrapper from "@/components/ApolloProvider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Assistly AI Chatbot Service",
  description:
    "Created by BOSS Ullas Shome. Copyright © 2025. All rights reserved.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "icon",
        url: "/favicon-16x16.png",
      },
      {
        rel: "icon",
        url: "/favicon-32x32.png",
      },
      {
        rel: "manifest",
        url: "/site.webmanifest",
      },
    ],
  },
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
