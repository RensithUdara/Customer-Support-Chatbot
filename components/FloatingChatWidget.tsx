'use client';

import React from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useChatContext } from './ChatContext';

const FloatingChatWidget: React.FC = () => {
    const { isPopupOpen, setIsPopupOpen } = useChatContext();

    const toggleChat = () => {
        setIsPopupOpen(!isPopupOpen);
    };

    return (
        <>
            {/* Floating Chat Button */}
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={toggleChat}
                    className={`
                        group relative flex items-center justify-center w-16 h-16 
                        bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800
                        text-white rounded-full shadow-lg hover:shadow-xl 
                        transition-all duration-300 transform hover:scale-105
                        ${isPopupOpen ? 'rotate-180' : 'rotate-0'}
                    `}
                    aria-label={isPopupOpen ? 'Close chat' : 'Open chat'}
                >
                    {isPopupOpen ? (
                        <X className="w-6 h-6 transition-transform duration-300" />
                    ) : (
                        <MessageCircle className="w-6 h-6 transition-transform duration-300" />
                    )}

                    {/* Pulse animation when closed */}
                    {!isPopupOpen && (
                        <div className="absolute inset-0 rounded-full bg-blue-600 animate-ping opacity-75"></div>
                    )}
                </button>

                {/* Tooltip */}
                {!isPopupOpen && (
                    <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        Need help? Chat with us!
                        <div className="absolute top-full right-4 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
                    </div>
                )}
            </div>
        </>
    );
};

export default FloatingChatWidget;