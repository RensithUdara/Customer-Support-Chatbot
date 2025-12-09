'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, Minimize2, ExternalLink, ThumbsUp, ThumbsDown } from 'lucide-react';
import Link from 'next/link';
import { useChatContext } from './ChatContext';

interface ChatResponse {
    reply: string;
    intent: string;
    confidence: number;
    sessionId: string;
}

const ChatPopup: React.FC = () => {
    const { isPopupOpen, setIsPopupOpen, messages, setMessages, sessionId } = useChatContext();
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messageFeedback, setMessageFeedback] = useState<{ [key: string]: 'like' | 'dislike' }>({});
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages are added
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Initialize with welcome message when popup first opens
    useEffect(() => {
        if (isPopupOpen && messages.length === 0) {
            const welcomeMessage = {
                id: 'popup_welcome',
                text: "👋 Hi! I'm your ShopEasy AI assistant. How can I help you today?\n\n" +
                    "💡 **Quick help:**\n" +
                    "• Track your orders\n" +
                    "• Check delivery policies\n" +
                    "• Find products\n" +
                    "• Get support info",
                sender: 'bot' as const,
                timestamp: new Date()
            };
            setMessages([welcomeMessage]);
        }
    }, [isPopupOpen, messages.length, setMessages]);

    const sendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'user' as const,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: inputValue,
                    sessionId
                })
            });

            if (!response.ok) {
                throw new Error('Failed to get response');
            }

            const data: ChatResponse = await response.json();

            const botMessage = {
                id: (Date.now() + 1).toString(),
                text: data.reply || "I apologize, but I couldn't process your request properly. Please try again.",
                sender: 'bot' as const,
                timestamp: new Date(),
                intent: data.intent
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            const errorMessage = {
                id: (Date.now() + 1).toString(),
                text: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
                sender: 'bot' as const,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleFeedback = async (messageId: string, feedbackType: 'like' | 'dislike') => {
        try {
            // Update local state
            setMessageFeedback(prev => ({
                ...prev,
                [messageId]: prev[messageId] === feedbackType ? undefined : feedbackType
            }));

            // Get message details
            const message = messages.find(m => m.id === messageId);

            // Send feedback to API
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    session_id: sessionId,
                    message_id: messageId,
                    bot_response: message?.text,
                    feedback_type: feedbackType,
                    intent: message?.intent,
                    confidence: message?.confidence
                })
            });

            if (!response.ok) {
                console.error('Failed to save feedback');
            }
        } catch (error) {
            console.error('Error sending feedback:', error);
        }
    };

    if (!isPopupOpen) return null;

    return (
        <div className="fixed bottom-24 right-6 z-40">
            {/* Chat Popup Container */}
            <div className="w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
                {/* Header - Match main chat design */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-base">ShopEasy Support</h3>
                            <p className="text-blue-100 text-sm flex items-center">
                                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                                AI Assistant • Online
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        {/* Expand to full chat page */}
                        <Link
                            href="/chat"
                            className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all"
                            title="Open in full page"
                        >
                            <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                            onClick={() => setIsPopupOpen(false)}
                            className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all"
                        >
                            <Minimize2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 chat-scrollbar">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`flex items-start space-x-2 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                                    }`}
                            >
                                <div
                                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${message.sender === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-600'
                                        }`}
                                >
                                    {message.sender === 'user' ? (
                                        <User className="w-3 h-3" />
                                    ) : (
                                        <Bot className="w-3 h-3" />
                                    )}
                                </div>
                                <div
                                    className={`px-3 py-2 rounded-2xl ${message.sender === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-800 border border-gray-200'
                                        }`}
                                >
                                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                                        {message.text}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                                    <Bot className="w-3 h-3 text-gray-600" />
                                </div>
                                <div className="bg-white px-3 py-2 rounded-2xl border border-gray-200">
                                    <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t border-gray-200 p-3 bg-white">
                    <div className="flex items-end space-x-2">
                        <div className="flex-1">
                            <textarea
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your message..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 placeholder-gray-500"
                                rows={1}
                                style={{
                                    minHeight: '36px',
                                    maxHeight: '72px',
                                }}
                                disabled={isLoading}
                            />
                        </div>
                        <button
                            onClick={sendMessage}
                            disabled={!inputValue.trim() || isLoading}
                            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Quick suggestion buttons */}
                    <div className="flex flex-wrap gap-2 mt-3">
                        <button
                            onClick={() => setInputValue('Where is my order 1015?')}
                            className="flex items-center bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-1.5 rounded-full text-xs font-medium hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-200 shadow-sm"
                            disabled={isLoading}
                        >
                            <span className="mr-1">📦</span>
                            Track Order
                        </button>
                        <button
                            onClick={() => setInputValue('What are your delivery times?')}
                            className="flex items-center bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1.5 rounded-full text-xs font-medium hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 shadow-sm"
                            disabled={isLoading}
                        >
                            <span className="mr-1">🚚</span>
                            Delivery
                        </button>
                        <button
                            onClick={() => setInputValue('Do you offer EMI plans?')}
                            className="flex items-center bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-medium hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-sm"
                            disabled={isLoading}
                        >
                            <span className="mr-1">💳</span>
                            Payment
                        </button>
                        <button
                            onClick={() => setInputValue('Best laptop under 200000')}
                            className="flex items-center bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1.5 rounded-full text-xs font-medium hover:from-purple-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-sm"
                            disabled={isLoading}
                        >
                            <span className="mr-1">💻</span>
                            Products
                        </button>
                        <button
                            onClick={() => setInputValue('How do I return an item?')}
                            className="flex items-center bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-full text-xs font-medium hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-sm"
                            disabled={isLoading}
                        >
                            <span className="mr-1">📋</span>
                            Returns
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatPopup;