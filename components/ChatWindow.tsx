'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    intent?: string;
}

interface ChatResponse {
    reply: string;
    intent: string;
    confidence: number;
    sessionId: string;
}

export default function ChatWindow() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId] = useState(() => 'session_' + Date.now());
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages are added
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Initialize with welcome message
    useEffect(() => {
        const welcomeMessage: Message = {
            id: 'welcome',
            text: "👋 Welcome to ShopEasy Customer Support! I'm here to help you with:\n\n" +
                "🔍 **Order Tracking** - Check your order status\n" +
                "📋 **Policies & FAQs** - Return policy, shipping, payments\n" +
                "🛍️ **Product Recommendations** - Find products based on your needs\n\n" +
                "Try asking me something like:\n" +
                "• \"Where is my order 1012?\"\n" +
                "• \"What is your return policy?\"\n" +
                "• \"Recommend a phone under 30000\"",
            sender: 'bot',
            timestamp: new Date()
        };
        setMessages([welcomeMessage]);
    }, []);

    const sendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'user',
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

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: data.reply,
                sender: 'bot',
                timestamp: new Date(),
                intent: data.intent
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
                sender: 'bot',
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

    const formatMessage = (text: string) => {
        // Convert markdown-like formatting to HTML
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br />');
    };

    const getIntentColor = (intent?: string) => {
        switch (intent) {
            case 'ORDER_STATUS': return 'bg-blue-100 text-blue-800';
            case 'POLICY': return 'bg-green-100 text-green-800';
            case 'PRODUCT_RECOMMENDATION': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getIntentLabel = (intent?: string) => {
        switch (intent) {
            case 'ORDER_STATUS': return 'Order Status';
            case 'POLICY': return 'Policy/FAQ';
            case 'PRODUCT_RECOMMENDATION': return 'Product Rec';
            default: return 'General';
        }
    };

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <div className="bg-blue-600 text-white p-4 shadow-md">
                <div className="flex items-center space-x-3">
                    <Bot className="w-8 h-8" />
                    <div>
                        <h1 className="text-xl font-semibold">ShopEasy Support</h1>
                        <p className="text-blue-100 text-sm">AI-Powered Customer Assistant</p>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[70%] rounded-lg px-4 py-2 ${message.sender === 'user'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                        >
                            <div className="flex items-start space-x-2">
                                {message.sender === 'bot' && <Bot className="w-5 h-5 mt-1 shrink-0" />}
                                {message.sender === 'user' && <User className="w-5 h-5 mt-1 shrink-0" />}
                                <div className="flex-1">
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: formatMessage(message.text)
                                        }}
                                        className="leading-relaxed"
                                    />
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-xs opacity-70">
                                            {message.timestamp.toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                        {message.intent && message.sender === 'bot' && (
                                            <span className={`text-xs px-2 py-1 rounded-full ${getIntentColor(message.intent)}`}>
                                                {getIntentLabel(message.intent)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-lg px-4 py-2 flex items-center space-x-2">
                            <Bot className="w-5 h-5" />
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-gray-600">Typing...</span>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t bg-gray-50 p-4">
                <div className="flex space-x-3">
                    <textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask me about orders, policies, or product recommendations..."
                        className="flex-1 min-h-11 max-h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                        rows={1}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!inputValue.trim() || isLoading}
                        className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>

                {/* Quick action buttons */}
                <div className="flex flex-wrap gap-2 mt-3">
                    <button
                        onClick={() => setInputValue('Where is my order 1012?')}
                        className="bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-50 transition-colors"
                        disabled={isLoading}
                    >
                        Track Order
                    </button>
                    <button
                        onClick={() => setInputValue('What is your return policy?')}
                        className="bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-50 transition-colors"
                        disabled={isLoading}
                    >
                        Return Policy
                    </button>
                    <button
                        onClick={() => setInputValue('Recommend a phone under 25000')}
                        className="bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-50 transition-colors"
                        disabled={isLoading}
                    >
                        Product Recommendation
                    </button>
                </div>
            </div>
        </div>
    );
}