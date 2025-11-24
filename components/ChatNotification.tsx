'use client';

import React, { useState, useEffect } from 'react';
import { X, MessageCircle } from 'lucide-react';

const ChatNotification: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show notification after 3 seconds
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 3000);

        // Auto-hide after 10 seconds
        const autoHideTimer = setTimeout(() => {
            setIsVisible(false);
        }, 13000);

        return () => {
            clearTimeout(timer);
            clearTimeout(autoHideTimer);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-24 right-24 z-30 max-w-sm">
            <div className="bg-white rounded-2xl shadow-2xl border border-blue-200 p-4 animate-slide-in-right">
                <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                            <MessageCircle className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 text-sm">
                                Need help? 👋
                            </h4>
                            <p className="text-gray-600 text-xs mt-1">
                                Try our floating chat widget! Click the chat icon below for instant support.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="text-gray-400 hover:text-gray-600 ml-2"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Arrow pointing to chat widget */}
            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white border-r border-b border-blue-200 transform rotate-45"></div>
        </div>
    );
};

export default ChatNotification;