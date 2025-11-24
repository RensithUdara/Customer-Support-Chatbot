import type { Metadata } from "next";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
