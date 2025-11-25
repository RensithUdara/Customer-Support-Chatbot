'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    intent?: string;
    confidence?: number;
    suggestions?: string[];
    followUpQuestions?: string[];
    isTyping?: boolean;
    metadata?: any;
}

interface ChatResponse {
    reply: string;
    intent: string;
    confidence: number;
    sessionId: string;
    suggestions?: string[];
    followUpQuestions?: string[];
    metadata?: any;
}

interface TypingIndicator {
    isVisible: boolean;
    message: string;
}

export default function ChatWindow() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId] = useState(() => 'session_' + Date.now());
    const [typingIndicator, setTypingIndicator] = useState<TypingIndicator>({ isVisible: false, message: 'AI is thinking...' });
    const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);
    const [conversationContext, setConversationContext] = useState<any>({});
    const [userPreferences, setUserPreferences] = useState({ responseStyle: 'friendly', technicalLevel: 'basic' });
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Auto-scroll to bottom when new messages are added
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Initialize with enhanced welcome message
    useEffect(() => {
        const welcomeMessage: Message = {
            id: 'welcome',
            text: "🎉 **Welcome to ShopEasy Support!** I'm your AI assistant with advanced capabilities:\n\n" +
                "🚀 **What I can do:**\n" +
                "📦 **Smart Order Tracking** - Real-time updates for orders 1001-1030\n" +
                "📋 **Intelligent FAQ System** - 50+ policies with context-aware answers\n" +
                "🛍️ **AI Product Recommendations** - 40+ products with smart filtering\n" +
                "💡 **Expert Insights** - Warranty, EMI, delivery optimization\n\n" +
                "⚡ **Quick Start - Try these:**\n" +
                "• \"Track my order 1015\" (Laptop - Express shipped)\n" +
                "• \"Gaming laptop under 200000\"\n" +
                "• \"Return policy for electronics\"\n" +
                "• \"EMI options available?\"\n\n" +
                "💬 **Pro Tip:** I learn from our conversation to give you better answers!",
            sender: 'bot',
            timestamp: new Date(),
            confidence: 1.0,
            suggestions: ['Track Order', 'Product Search', 'Policies', 'Payment Info'],
            followUpQuestions: [
                "Looking for a specific product category?",
                "Need help with an existing order?",
                "Want to know about our policies?"
            ]
        };
        setMessages([welcomeMessage]);
    }, []);

    const handleSuggestionClick = (suggestion: string) => {
        setInputValue(suggestion);
        setSelectedSuggestion(suggestion);
        // Auto-send the suggestion
        setTimeout(() => {
            sendMessage(suggestion);
        }, 100);
    };

    const sendMessage = async (messageText?: string) => {
        const textToSend = messageText || inputValue;
        if (!textToSend.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: textToSend,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setSelectedSuggestion(null);
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
                text: data.reply || "I apologize, but I couldn't process your request properly. Please try again.",
                sender: 'bot',
                timestamp: new Date(),
                intent: data.intent,
                confidence: data.confidence,
                suggestions: data.suggestions || [],
                followUpQuestions: data.followUpQuestions || [],
                metadata: data.metadata
            };
            
            // Update conversation context
            setConversationContext({
                lastIntent: data.intent,
                hasHistory: data.conversationContext?.hasHistory || false,
                messageCount: data.conversationContext?.messageCount || 0
            });

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
                        className="flex-1 min-h-11 max-h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
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
                <div className="flex flex-wrap gap-3 mt-4">
                    <button
                        onClick={() => setInputValue('Where is my order 1015?')}
                        className="bg-linear-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-md"
                        disabled={isLoading}
                    >
                        📦 Track Order
                    </button>
                    <button
                        onClick={() => setInputValue('What are your delivery times?')}
                        className="bg-linear-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 shadow-md"
                        disabled={isLoading}
                    >
                        🚚 Delivery Info
                    </button>
                    <button
                        onClick={() => setInputValue('Best laptop under 200000')}
                        className="bg-linear-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-purple-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-md"
                        disabled={isLoading}
                    >
                        💻 Find Products
                    </button>
                    <button
                        onClick={() => setInputValue('Do you offer EMI plans?')}
                        className="bg-linear-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-200 shadow-md"
                        disabled={isLoading}
                    >
                        💳 Payment Options
                    </button>
                    <button
                        onClick={() => setInputValue('How do I return an item?')}
                        className="bg-linear-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-md"
                        disabled={isLoading}
                    >
                        🔄 Returns
                    </button>
                </div>
            </div>
        </div>
    );
}