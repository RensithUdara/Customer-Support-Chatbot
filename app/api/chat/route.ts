import { NextRequest, NextResponse } from 'next/server';
import { detectIntent, extractKeywords } from '@/lib/intent';
import { searchFAQs, searchProducts, saveConversation, searchBestFAQ } from '@/lib/db';
import { callLLM } from '@/lib/llm';
import { ResponseGenerator, generateDynamicResponse } from '@/lib/responseGenerator';
import { DatabaseQueryHandler } from '@/lib/databaseQueryHandler';

export async function POST(request: NextRequest) {
    try {
        const { message, sessionId = 'anonymous' } = await request.json();

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        // Save user message to conversation history
        await saveConversation(sessionId, message, 'user');

        // Detect intent from the message (now async with Dialogflow)
        const intentResult = await detectIntent(message);
        console.log('Intent detected:', intentResult);

        // Log Dialogflow data if available
        if (intentResult.dialogflowData) {
            console.log('Dialogflow intent:', intentResult.dialogflowData.originalIntent);
            console.log('Dialogflow confidence:', intentResult.confidence);
        }

        let botReply = '';
        let systemPrompt = '';
        let context: any = {};

        // Use modular handlers based on intent
        switch (intentResult.intent) {
            case 'ORDER_STATUS':
                if (intentResult.extractedData?.orderId) {
                    const orderId = intentResult.extractedData.orderId.toString();
                    console.log('🔍 ORDER_STATUS:', { orderId, query: message });
                    botReply = await DatabaseQueryHandler.handleOrderStatus(orderId, message);
                } else {
                    botReply = "I'd be happy to help track your order! Please provide your order number (usually 4 digits like 1001).";
                }
                break;

            case 'ORDER_ITEMS':
                if (intentResult.extractedData?.orderId) {
                    const orderId = intentResult.extractedData.orderId.toString();
                    console.log('📦 ORDER_ITEMS:', { orderId, query: message });
                    botReply = await DatabaseQueryHandler.handleOrderItems(orderId, message);
                } else {
                    botReply = "I'd be happy to show you the items in your order! Please provide your order number.";
                }
                break;

            case 'ORDER_DETAILS':
                if (intentResult.extractedData?.orderId) {
                    const orderId = intentResult.extractedData.orderId.toString();
                    console.log('📋 ORDER_DETAILS:', { orderId, query: message });
                    botReply = await DatabaseQueryHandler.handleOrderDetails(orderId, message);
                } else {
                    botReply = "I'd be happy to provide complete order details! Please provide your order number.";
                }
                break;

            case 'WARRANTY_INFO':
                console.log('🛡️ WARRANTY_INFO:', { category: intentResult.extractedData?.category, query: message });
                botReply = await DatabaseQueryHandler.handleWarrantyQuery(message, intentResult.extractedData?.category);
                break;

            case 'SPECIFIC_SUPPORT':
                const supportType = intentResult.extractedData?.supportType || 'general';
                console.log('📞 SPECIFIC_SUPPORT:', { supportType, query: message });
                botReply = await DatabaseQueryHandler.handleSupportQuery(message, supportType);
                break;

            case 'PAYMENT_METHODS':
                console.log('💳 PAYMENT_METHODS:', { query: message });
                botReply = await ResponseGenerator.generatePaymentMethodsResponse();
                break;

            case 'DELIVERY_METHODS':
                console.log('🚚 DELIVERY_METHODS:', { query: message });
                botReply = await ResponseGenerator.generateDeliveryMethodsResponse();
                break;

            case 'RETURN_POLICIES':
                console.log('📋 RETURN_POLICIES:', { query: message });
                botReply = await ResponseGenerator.generateReturnPoliciesResponse(message);
                break;

            case 'DATABASE_QUERY':
                console.log('🗃️ DATABASE_QUERY:', { query: message, dialogflowData: intentResult.dialogflowData });
                botReply = await DatabaseQueryHandler.handleDatabaseQuery(message, intentResult.dialogflowData);
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

            case 'POLICY':
                console.log('📜 POLICY:', { query: message });
                botReply = await ResponseGenerator.generatePolicyResponse(message);
                break;

            case 'OTHER':
            default:
                console.log('❓ DEFAULT/FALLBACK:', { intent: intentResult.intent, query: message });
                // Use ResponseGenerator for any unhandled intents or fallback cases
                botReply = await ResponseGenerator.generateDynamicResponse(
                    intentResult.intent || 'GENERAL',
                    message,
                    intentResult.extractedData || {},
                    intentResult.dialogflowData || null
                );
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
