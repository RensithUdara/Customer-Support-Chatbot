import { NextRequest, NextResponse } from 'next/server';
import { detectIntent, extractKeywords } from '@/lib/intent';
import { searchFAQs, getOrderById, searchProducts, saveConversation, searchBestFAQ } from '@/lib/db';
import { callLLM } from '@/lib/llm';

export async function POST(request: NextRequest) {
    try {
        const { message, sessionId = 'anonymous' } = await request.json();

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        // Save user message to conversation history
        await saveConversation(sessionId, message, 'user');

        // Detect intent from the message
        const intentResult = detectIntent(message);
        console.log('Intent detected:', intentResult);

        let botReply = '';
        let systemPrompt = '';
        let context: any = {};

        switch (intentResult.intent) {
            case 'ORDER_STATUS':
                systemPrompt = 'You are a helpful customer service agent providing order status information. Be polite and informative.';

                if (intentResult.extractedData?.orderId) {
                    const order = await getOrderById(intentResult.extractedData.orderId);
                    context.order = order;

                    const llmResponse = await callLLM({
                        systemPrompt: systemPrompt + ' Focus on explaining the order status clearly.',
                        userMessage: message,
                        context
                    });

                    botReply = llmResponse.reply;
                } else {
                    botReply = "I'd be happy to help you track your order! Could you please provide your order number? It's usually a 4-6 digit number like 1001 or 1234.";
                }
                break;

            case 'POLICY':
                // Return exact database answer for policy questions
                const keywords = extractKeywords(message);
                const bestMatch = await searchBestFAQ(message, keywords);

                if (bestMatch && bestMatch.answer) {
                    botReply = bestMatch.answer + "\n\nIs there anything specific about this policy you'd like me to explain further?";
                } else {
                    // Fallback to general search
                    const relevantFAQs = await searchFAQs(keywords);
                    if (relevantFAQs.length > 0) {
                        botReply = relevantFAQs[0].answer + "\n\nIs there anything specific about this policy you'd like me to explain further?";
                    } else {
                        botReply = "I'd be happy to help you with policy information. Could you please be more specific about what you'd like to know about our shipping, returns, payments, or other policies?";
                    }
                }
                break;

            case 'PRODUCT_RECOMMENDATION':
                systemPrompt = 'You are a product recommendation expert. Help customers find the best products based on their needs and budget.';

                const { category, budget, tags } = intentResult.extractedData || {};
                const products = await searchProducts(category, budget, tags?.join(','));
                context.products = products;

                const productResponse = await callLLM({
                    systemPrompt: systemPrompt + ' Recommend products based on the provided list and customer requirements.',
                    userMessage: message,
                    context
                });

                botReply = productResponse.reply;
                break;

            case 'OTHER':
            default:
                // Try to find relevant FAQs for general questions and return exact answers
                const generalKeywords = extractKeywords(message);
                const generalBestMatch = await searchBestFAQ(message, generalKeywords);

                if (generalBestMatch && generalBestMatch.answer) {
                    botReply = generalBestMatch.answer + "\n\nIs there anything specific about this policy you'd like me to explain further?";
                } else {
                    const generalFAQs = await searchFAQs(generalKeywords);
                    if (generalFAQs.length > 0) {
                        botReply = generalFAQs[0].answer + "\n\nIs there anything specific about this policy you'd like me to explain further?";
                    } else {
                        botReply = "Hello! I'm here to help you with:\n\n" +
                            "🔍 **Order Tracking** - Check your order status (e.g., 'Where is order 1012?')\n" +
                            "📋 **Policies & FAQs** - Return policy, shipping, payments, warranty\n" +
                            "🛍️ **Product Recommendations** - Find products based on your budget and needs\n\n" +
                            "How can I assist you today?";
                    }
                }
                break;
        }

        // Save bot response to conversation history
        await saveConversation(sessionId, botReply, 'bot', intentResult.intent);

        // Debug logging
        console.log('Bot reply being sent:', {
            reply: botReply,
            replyType: typeof botReply,
            replyLength: botReply?.length
        });

        return NextResponse.json({
            reply: botReply || "I apologize, but I couldn't generate a proper response. Please try again.",
            intent: intentResult.intent,
            confidence: intentResult.confidence,
            sessionId
        });

    } catch (error) {
        console.error('Chat API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error. Please try again.' },
            { status: 500 }
        );
    }
}

// Health check endpoint
export async function GET() {
    return NextResponse.json({
        status: 'OK',
        message: 'Customer Support Chatbot API is running',
        timestamp: new Date().toISOString()
    });
}