import type { Metadata } from "next";
import "./globals.css";
import { ChatProvider } from "@/components/ChatContext";
import FloatingChatWidget from "@/components/FloatingChatWidget";
import ChatPopup from "@/components/ChatPopup";

export const metadata: Metadata = {
  title: "ShopEasy - Customer Support Chatbot",
  description: "AI-powered customer support chatbot for e-commerce platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <ChatProvider>
          {children}
          <FloatingChatWidget />
          <ChatPopup />
        </ChatProvider>
      </body>
    </html>
  );
}
