'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, ThumbsUp, ThumbsDown, Mic, MicOff } from 'lucide-react';

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
    feedback?: 'like' | 'dislike' | null;
}

interface ChatResponse {
    reply: string;
    intent: string;
    confidence: number;
    sessionId: string;
    suggestions?: string[];
    followUpQuestions?: string[];
    metadata?: any;
    conversationContext?: {
        hasHistory?: boolean;
        messageCount?: number;
    };
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
    const [isListening, setIsListening] = useState(false);
    const [voiceSupported, setVoiceSupported] = useState(false);
    const [userName, setUserName] = useState<string | null>(null);
    const [hasGreeted, setHasGreeted] = useState(false);
    const [awaitingName, setAwaitingName] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const recognitionRef = useRef<any>(null);

    // Auto-scroll to bottom when new messages are added
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Initialize voice recognition
    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            setVoiceSupported(true);
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.language = 'en-US';

            recognition.onstart = () => {
                setIsListening(true);
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognition.onresult = (event: any) => {
                let transcript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    transcript += event.results[i][0].transcript;
                }
                if (transcript) {
                    setInputValue(transcript);
                    // Auto-send the voice input after a short delay
                    setTimeout(() => {
                        sendMessage(transcript);
                    }, 500);
                }
            };

            recognition.onerror = (event: any) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
            };

            recognitionRef.current = recognition;
        }
    }, []);

    const toggleVoiceInput = () => {
        if (!recognitionRef.current) return;

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            setInputValue('');
            recognitionRef.current.start();
        }
    };

    // Initialize with welcome message - Greeting flow
    useEffect(() => {
        const welcomeMessage: Message = {
            id: 'welcome',
            text: `👋 **Welcome to ShopEasy Support!** 😊\n\n` +
                `I'm your friendly AI assistant here to help you 24/7!\n\n` +
                `🚀 **What I can do for you:**\n` +
                `📦 Track your orders in real-time\n` +
                `🛍️ Recommend products that match your needs\n` +
                `❓ Answer all your questions about policies\n` +
                `📞 Connect you with our support team\n\n` +
                `**Before we begin, what's your name?** Just say "hi" or type your name to get started! 🤝`,
            sender: 'bot',
            timestamp: new Date(),
            confidence: 1.0,
            suggestions: [],
            followUpQuestions: []
        };
        setMessages([welcomeMessage]);
        setAwaitingName(true);
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
                    message: textToSend,
                    sessionId,
                    userName: userName
                })
            });

            if (!response.ok) {
                throw new Error('Failed to get response');
            }

            const data: ChatResponse & { extractedName?: string } = await response.json();

            // Extract name if provided by user
            if (data.extractedName && !userName) {
                setUserName(data.extractedName);
                setAwaitingName(false);
                setHasGreeted(true);
            }

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

    const handleFeedback = async (messageId: string, feedbackType: 'like' | 'dislike') => {
        try {
            setMessages(prevMessages =>
                prevMessages.map(msg =>
                    msg.id === messageId ? { ...msg, feedback: feedbackType } : msg
                )
            );

            const message = messages.find(m => m.id === messageId);

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

    const formatMessage = (text: string) => {
        // Convert markdown-like formatting to HTML
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br />');
    };

    const getIntentColor = (intent?: string) => {
        switch (intent) {
            case 'ORDER_STATUS': return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300';
            case 'POLICY': return 'bg-gradient-to-r from-emerald-100 to-green-200 text-green-800 border border-green-300';
            case 'PRODUCT_RECOMMENDATION': return 'bg-gradient-to-r from-purple-100 to-indigo-200 text-purple-800 border border-purple-300';
            case 'DELIVERY_METHODS': return 'bg-gradient-to-r from-orange-100 to-amber-200 text-orange-800 border border-orange-300';
            case 'RETURN_POLICIES': return 'bg-gradient-to-r from-rose-100 to-red-200 text-red-800 border border-red-300';
            case 'DATABASE_QUERY': return 'bg-gradient-to-r from-cyan-100 to-teal-200 text-cyan-800 border border-cyan-300';
            default: return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300';
        }
    };

    const getIntentLabel = (intent?: string) => {
        switch (intent) {
            case 'ORDER_STATUS': return '📦 Order Status';
            case 'POLICY': return '📋 Policy/FAQ';
            case 'PRODUCT_RECOMMENDATION': return '🛍️ Product Rec';
            case 'DELIVERY_METHODS': return '🚚 Delivery';
            case 'RETURN_POLICIES': return '🔄 Returns';
            case 'DATABASE_QUERY': return '📊 Data Query';
            default: return '🤖 General';
        }
    };

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white p-6 shadow-lg relative overflow-hidden">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-white rounded-full animate-pulse"></div>
                    <div className="absolute top-8 -left-8 w-16 h-16 bg-white rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
                </div>

                <div className="flex items-center space-x-4 relative z-10">
                    <div className="bg-white bg-opacity-20 p-3 rounded-xl backdrop-blur-sm">
                        <Bot className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                            ShopEasy Support
                        </h1>
                        <p className="text-blue-100 text-sm flex items-center space-x-1">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            <span>AI-Powered Assistant • Always Online</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent">
                {messages.map((message, index) => (
                    <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <div
                            className={`max-w-[85%] relative group ${message.sender === 'user'
                                ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200 rounded-t-2xl rounded-bl-2xl rounded-br-sm'
                                : 'bg-white text-gray-800 shadow-lg shadow-gray-200 border border-gray-100 rounded-t-2xl rounded-br-2xl rounded-bl-sm'
                                } transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}
                        >
                            <div className="p-4">
                                {/* Avatar for bot messages */}
                                {message.sender === 'bot' && (
                                    <div className="absolute -left-4 -top-2 w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg border-3 border-white">
                                        <Bot className="w-5 h-5 text-white" />
                                    </div>
                                )}

                                {/* Avatar for user messages */}
                                {message.sender === 'user' && (
                                    <div className="absolute -right-4 -top-2 w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg border-3 border-white">
                                        <User className="w-5 h-5 text-white" />
                                    </div>
                                )}

                                <div className="flex-1">
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: formatMessage(message.text)
                                        }}
                                        className="leading-relaxed text-sm lg:text-base"
                                    />


                                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                                        <span className="text-xs opacity-60 flex items-center space-x-1">
                                            <span>🕒</span>
                                            <span>{message.timestamp.toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}</span>
                                            {message.confidence && (
                                                <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
                                                    {Math.round(message.confidence * 100)}% confident
                                                </span>
                                            )}
                                        </span>

                                        {/* Feedback buttons for bot messages */}
                                        {message.sender === 'bot' && (
                                            <div className="flex flex-col items-start gap-2">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => handleFeedback(message.id, 'like')}
                                                        className={`p-1.5 rounded transition-all duration-200 ${message.feedback === 'like'
                                                            ? 'bg-green-100 text-green-600'
                                                            : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                                                            }`}
                                                        title="This answer was helpful"
                                                        aria-label="Like"
                                                    >
                                                        <ThumbsUp className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleFeedback(message.id, 'dislike')}
                                                        className={`p-1.5 rounded transition-all duration-200 ${message.feedback === 'dislike'
                                                            ? 'bg-red-100 text-red-600'
                                                            : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                                                            }`}
                                                        title="This answer was not helpful"
                                                        aria-label="Dislike"
                                                    >
                                                        <ThumbsDown className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {message.intent && message.sender === 'bot' && (
                                            <span className={`text-xs px-3 py-1 rounded-full font-semibold shadow-sm ${getIntentColor(message.intent)}`}>
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
                    <div className="flex justify-start animate-fade-in">
                        <div className="bg-white shadow-lg border border-gray-100 rounded-t-2xl rounded-br-2xl rounded-bl-sm px-6 py-4 flex items-center space-x-3 relative">
                            <div className="absolute -left-4 -top-2 w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg border-3 border-white">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                            <span className="text-gray-600 font-medium">AI is thinking...</span>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t bg-gradient-to-r from-gray-50 to-white p-6 shadow-lg">
                <div className="flex space-x-4">
                    <div className="flex-1 relative">
                        <textarea
                            ref={inputRef}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="💬 Ask me about orders, policies, or product recommendations..."
                            className="w-full min-h-12 max-h-32 p-4 pr-12 border-2 border-gray-200 rounded-2xl resize-none focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-200 bg-white"
                            disabled={isLoading}
                            rows={1}
                        />
                        <div className="absolute right-3 top-3 text-gray-400 flex items-center space-x-2">
                            <span className="text-sm">✨</span>
                            {voiceSupported && (
                                <button
                                    onClick={toggleVoiceInput}
                                    className={`p-2 rounded-lg transition-all duration-200 ${isListening
                                        ? 'bg-red-100 text-red-600 animate-pulse'
                                        : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                                        }`}
                                    title={isListening ? 'Stop listening' : 'Start voice input'}
                                    aria-label={isListening ? 'Stop listening' : 'Start voice input'}
                                >
                                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                                </button>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={() => sendMessage()}
                        disabled={!inputValue.trim() || isLoading}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 text-white p-4 rounded-2xl disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>

                {/* Quick action buttons */}
                <div className="flex flex-wrap justify-center gap-3 mt-6">
                    <button
                        onClick={() => setInputValue('Where is my order 1015?')}
                        className="group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-5 py-3 rounded-2xl text-sm font-semibold transform hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none flex items-center space-x-2"
                        disabled={isLoading}
                    >
                        <span className="group-hover:animate-bounce">📦</span>
                        <span>Track Order</span>
                    </button>
                    <button
                        onClick={() => setInputValue('What are your delivery times?')}
                        className="group bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-5 py-3 rounded-2xl text-sm font-semibold transform hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none flex items-center space-x-2"
                        disabled={isLoading}
                    >
                        <span className="group-hover:animate-bounce">🚚</span>
                        <span>Delivery Info</span>
                    </button>
                    <button
                        onClick={() => setInputValue('Best laptop under 200000')}
                        className="group bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-5 py-3 rounded-2xl text-sm font-semibold transform hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none flex items-center space-x-2"
                        disabled={isLoading}
                    >
                        <span className="group-hover:animate-bounce">💻</span>
                        <span>Find Products</span>
                    </button>
                    <button
                        onClick={() => setInputValue('Do you offer EMI plans?')}
                        className="group bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-5 py-3 rounded-2xl text-sm font-semibold transform hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none flex items-center space-x-2"
                        disabled={isLoading}
                    >
                        <span className="group-hover:animate-bounce">💳</span>
                        <span>Payment Options</span>
                    </button>
                    <button
                        onClick={() => setInputValue('How do I return an item?')}
                        className="group bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white px-5 py-3 rounded-2xl text-sm font-semibold transform hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none flex items-center space-x-2"
                        disabled={isLoading}
                    >
                        <span className="group-hover:animate-bounce">🔄</span>
                        <span>Returns</span>
                    </button>
                </div>
            </div>
        </div>
    );
}