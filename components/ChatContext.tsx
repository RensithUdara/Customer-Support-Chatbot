'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    intent?: string;
}

interface ChatContextType {
    isPopupOpen: boolean;
    setIsPopupOpen: (open: boolean) => void;
    messages: Message[];
    setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void;
    sessionId: string;
    userName: string | null;
    setUserName: (name: string | null) => void;
    hasGreeted: boolean;
    setHasGreeted: (greeted: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChatContext must be used within a ChatProvider');
    }
    return context;
};

interface ChatProviderProps {
    children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [sessionId] = useState(() => 'popup_session_' + Date.now());
    const [userName, setUserName] = useState<string | null>(null);
    const [hasGreeted, setHasGreeted] = useState(false);

    return (
        <ChatContext.Provider value={{
            isPopupOpen,
            setIsPopupOpen,
            messages,
            setMessages,
            sessionId,
            userName,
            setUserName,
            hasGreeted,
            setHasGreeted
        }}>
            {children}
        </ChatContext.Provider>
    );
};