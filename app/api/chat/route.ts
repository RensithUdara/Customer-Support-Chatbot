import { NextRequest, NextResponse } from 'next/server';
import { detectIntent, extractKeywords } from '@/lib/intent';
import { searchFAQs, getOrderById, searchProducts, saveConversation, searchBestFAQ, getDeliveryMethods, getReturnPolicies, getReturnPoliciesByCategory, getReturnFAQs, smartDatabaseQuery } from '@/lib/db';
import { callLLM } from '@/lib/llm';

// Type definitions for database entities
interface Order {
    id?: number;
    orderId: string;
    customerId?: string;
    customerName: string;
    customerEmail?: string;
    customerPhone?: string;
    status: string;
    orderDate: string;
    totalAmount?: number;
    paymentMethod?: string;
    shippingAddress?: string;
    trackingNumber?: string;
    estimatedDelivery?: string;
    items?: string;
}

interface FAQ {
    id: number;
    question: string;
    answer: string;
    category: string;
    tags?: string;
}

interface ReturnPolicy {
    id: number;
    policy_name?: string;
    product_category?: string;
    return_period: number;
    condition_required: string;
    return_shipping: string;
    refund_method: string;
    processing_time: number;
    exchange_allowed: boolean;
    restocking_fee: number;
}

interface DatabaseQueryResult {
    type: string;
    data: any[] | null;
    supportType?: string;
}

export async function POST(request: NextRequest) {
    try {
        const { message, sessionId = 'anonymous' } = await request.json();

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        // Get recent conversation history for context
        const conversationHistory = await getConversationHistory(sessionId, 6); // Last 6 messages
        
        // Save user message to conversation history
        await saveConversation(sessionId, message, 'user');

        // Detect intent from the message with conversation context
        const intentResult = detectIntentWithContext(message, conversationHistory);
        console.log('Intent detected:', intentResult);

        let botReply = '';
        let systemPrompt = '';
        let context: any = {};

        switch (intentResult.intent) {
            case 'ORDER_STATUS':
                if (intentResult.extractedData?.orderId) {
                    const orderResult = await getOrderById(intentResult.extractedData.orderId.toString());
                    const order = orderResult as Order | undefined;

                    if (order) {
                        // Check if user is asking for detailed information or just basic tracking
                        const isDetailedRequest = message.toLowerCase().includes('detail') ||
                            message.toLowerCase().includes('information') ||
                            message.toLowerCase().includes('full') ||
                            message.toLowerCase().includes('complete');

                        if (isDetailedRequest) {
                            // Show detailed information (without sensitive personal data)
                            let itemsInfo = '';
                            try {
                                const items = JSON.parse(order.items || '[]');
                                if (items.length > 0) {
                                    itemsInfo = '\n\n**Items ordered:**\n' +
                                        items.map((item: any, index: number) =>
                                            `${index + 1}. ${item.name} (${item.category}) - Qty: ${item.quantity} - Rs.${item.price.toLocaleString()}`
                                        ).join('\n');
                                }
                            } catch (e) {
                                itemsInfo = '\n\n**Items:** Order details available';
                            }

                            botReply = `📦 **Order #${order.orderId}** - ${order.status}\n\n` +
                                `👤 **Customer:** ${order.customerName}\n` +
                                `📅 **Order Date:** ${order.orderDate}\n` +
                                `💰 **Total Amount:** Rs.${order.totalAmount?.toLocaleString()}\n` +
                                `💳 **Payment Method:** ${order.paymentMethod}\n` +
                                `🚚 **Tracking Number:** ${order.trackingNumber}\n` +
                                `📦 **Estimated Delivery:** ${order.estimatedDelivery}` +
                                itemsInfo;
                        } else {
                            // Show basic tracking information only (privacy-safe)
                            botReply = `📦 **Order #${order.orderId}** - ${order.status}\n\n` +
                                `🚚 **Tracking Number:** ${order.trackingNumber}\n` +
                                `📅 **Order Date:** ${order.orderDate}\n` +
                                `📦 **Estimated Delivery:** ${order.estimatedDelivery}\n\n` +
                                `💡 Ask for "order details" if you need more information.`;
                        }
                    } else {
                        botReply = "I couldn't find that order number. Please double-check your order ID and try again, or contact our support team for assistance.";
                    }
                } else {
                    botReply = "I'd be happy to help you track your order! Could you please provide your order number? It's usually a 4-digit number like 1001 or 1015.";
                }
                break;

            case 'DELIVERY_METHODS':
                // Show all available delivery methods
                const deliveryMethods = getDeliveryMethods();
                let deliveryMethodsText = '🚚 **Available Delivery Methods:**\n\n';

                deliveryMethods.forEach((method: any, index: number) => {
                    deliveryMethodsText += `**${index + 1}. ${method.method}** (${method.provider})\n`;
                    deliveryMethodsText += `   📍 Coverage: ${method.coverage_area}\n`;
                    deliveryMethodsText += `   ⏱️ Delivery Time: ${method.delivery_time}\n`;
                    deliveryMethodsText += `   💰 Cost: Rs.${method.cost}\n`;
                    deliveryMethodsText += `   📦 Weight Limit: ${method.weight_limit}kg\n`;
                    deliveryMethodsText += `   🚚 Tracking: ${method.tracking_available ? 'Yes' : 'No'}\n`;
                    deliveryMethodsText += `   💵 COD Available: ${method.cod_available ? 'Yes' : 'No'}\n`;
                    if (method.insurance_included) {
                        deliveryMethodsText += `   🛡️ Insurance: Included\n`;
                    }
                    deliveryMethodsText += '\n';
                });

                deliveryMethodsText += '💡 Choose the method that best suits your needs!';
                botReply = deliveryMethodsText;
                break;

            case 'RETURN_POLICIES':
                // Check if user is asking for category-specific return policy
                const categories = ['electronics', 'fashion', 'home', 'kitchen', 'sports', 'toys', 'health', 'books', 'beauty'];
                const messageWords = message.toLowerCase().split(' ');
                const foundCategory = categories.find(cat => messageWords.some((word: string) => word.includes(cat)));

                // Find the most relevant FAQ for their specific question
                const bestReturnFAQ = searchBestFAQ(message, extractKeywords(message));

                let returnPolicyText = '';
                let returnPolicies;

                if (foundCategory) {
                    // Show category-specific return policies
                    returnPolicies = getReturnPoliciesByCategory(foundCategory);
                    if (returnPolicies.length > 0) {
                        const policy = returnPolicies[0] as ReturnPolicy;
                        returnPolicyText = `📋 **Return Policy for ${foundCategory.charAt(0).toUpperCase() + foundCategory.slice(1)} Products:**\n\n`;
                        returnPolicyText += `⏰ **Return Period:** ${policy.return_period} days\n`;
                        returnPolicyText += `📦 **Condition Required:** ${policy.condition_required}\n`;
                        returnPolicyText += `🚚 **Return Shipping:** ${policy.return_shipping}\n`;
                        returnPolicyText += `💰 **Refund Method:** ${policy.refund_method}\n`;
                        returnPolicyText += `⚡ **Processing Time:** ${policy.processing_time} days\n`;
                        returnPolicyText += `🔄 **Exchange:** ${policy.exchange_allowed ? 'Available' : 'Not Available'}\n`;
                        if (policy.restocking_fee > 0) {
                            returnPolicyText += `💸 **Restocking Fee:** Rs.${policy.restocking_fee}\n`;
                        }
                    }
                } else {
                    // For general return policy questions, show a summary
                    returnPolicies = getReturnPolicies();
                    returnPolicyText = '📋 **Return Policy Summary:**\n\n';
                    returnPolicies.forEach((policy: any) => {
                        if (policy.return_period > 0) { // Skip non-returnable categories
                            returnPolicyText += `• **${policy.product_category}:** ${policy.return_period} days - ${policy.condition_required}\n`;
                        }
                    });
                }

                // Only add FAQ if it's truly relevant and doesn't conflict with policy
                const faqResult = bestReturnFAQ as FAQ | undefined;
                if (faqResult && faqResult.question && faqResult.answer && foundCategory) {
                    // Don't show generic return policy FAQ if we already showed specific category policy
                    const isConflictingFAQ = faqResult.answer.includes('14 days') ||
                        faqResult.answer.includes('Items may be returned within') ||
                        faqResult.question.includes('What is your return policy');

                    if (!isConflictingFAQ) {
                        returnPolicyText += `\n❓ **Additional Info:**\n\n`;
                        returnPolicyText += `**Q: ${faqResult.question}**\n`;
                        returnPolicyText += `A: ${faqResult.answer}\n`;
                    }
                } else if (!foundCategory && faqResult && faqResult.question && faqResult.answer) {
                    // For general queries, show the FAQ
                    returnPolicyText += `\n❓ **Related FAQ:**\n\n`;
                    returnPolicyText += `**Q: ${faqResult.question}**\n`;
                    returnPolicyText += `A: ${faqResult.answer}\n`;
                }

                returnPolicyText += '\n💡 Need more help? Contact our support team!';
                botReply = returnPolicyText;
                break;

            case 'POLICY':
                // Return exact database answer for policy questions
                const keywords = extractKeywords(message);
                const bestMatch = await searchBestFAQ(message, keywords);
                const policyFaq = bestMatch as FAQ | undefined;

                if (policyFaq && policyFaq.answer) {
                    botReply = policyFaq.answer + "\n\nIs there anything specific about this policy you'd like me to explain further?";
                } else {
                    // Fallback to general search
                    const relevantFAQs = await searchFAQs(keywords);
                    if (relevantFAQs.length > 0) {
                        const firstFaq = relevantFAQs[0] as FAQ;
                        botReply = firstFaq.answer + "\n\nIs there anything specific about this policy you'd like me to explain further?";
                    } else {
                        botReply = "I'd be happy to help you with policy information. Could you please be more specific about what you'd like to know about our shipping, returns, payments, or other policies?";
                    }
                }
                break;

            case 'DATABASE_QUERY':
                // Handle comprehensive database queries for any table data
                const queryResult = smartDatabaseQuery(message) as DatabaseQueryResult;
                let databaseResponse = '';

                switch (queryResult.type) {
                    case 'payment_methods':
                        databaseResponse = '💳 **Available Payment Methods:**\n\n';
                        queryResult.data?.forEach((method: any, index: number) => {
                            databaseResponse += `**${index + 1}. ${method.type}** (${method.provider})\n`;
                            databaseResponse += `   💰 Processing Fee: ${method.processing_fee}%\n`;
                            databaseResponse += `   ⚡ Processing Time: ${method.processing_time}\n`;
                            if (method.features) {
                                databaseResponse += `   ✨ Features: ${method.features}\n`;
                            }
                            databaseResponse += '\n';
                        });
                        break;

                    case 'warranty':
                        databaseResponse = '🛡️ **Warranty Policies:**\n\n';
                        queryResult.data?.forEach((warranty: any, index: number) => {
                            databaseResponse += `**${index + 1}. ${warranty.product_category}**\n`;
                            databaseResponse += `   ⏰ Warranty Period: ${warranty.warranty_period} months\n`;
                            databaseResponse += `   📋 Coverage: ${warranty.coverage_details}\n`;
                            databaseResponse += `   🔄 Claim Process: ${warranty.claim_process}\n`;
                            if (warranty.exclusions) {
                                databaseResponse += `   ❌ Exclusions: ${warranty.exclusions}\n`;
                            }
                            databaseResponse += '\n';
                        });
                        break;

                    case 'shipping_zones':
                        databaseResponse = '📍 **Shipping Zones & Areas:**\n\n';
                        queryResult.data?.forEach((zone: any, index: number) => {
                            databaseResponse += `**${index + 1}. ${zone.zone_name}**\n`;
                            databaseResponse += `   🌍 Regions: ${zone.regions}\n`;
                            databaseResponse += `   💰 Standard Cost: Rs.${zone.standard_cost} | Express: Rs.${zone.express_cost}\n`;
                            databaseResponse += `   ⚡ Delivery Time: ${zone.standard_delivery_days} days (standard) | ${zone.express_delivery_days} days (express)\n`;
                            databaseResponse += `   📦 COD Available: ${zone.cod_available ? 'Yes' : 'No'}\n`;
                            databaseResponse += '\n';
                        });
                        break;

                    case 'promotions':
                        databaseResponse = '🎉 **Current Promotions & Offers:**\n\n';
                        queryResult.data?.forEach((promo: any, index: number) => {
                            databaseResponse += `**${index + 1}. ${promo.promo_name}**\n`;
                            databaseResponse += `   🏷️ Code: ${promo.promo_code}\n`;
                            databaseResponse += `   💰 Discount: ${promo.discount_percentage}% or Rs.${promo.discount_amount}\n`;
                            databaseResponse += `   📅 Valid Until: ${promo.end_date}\n`;
                            databaseResponse += `   📋 Description: ${promo.description}\n`;
                            databaseResponse += '\n';
                        });
                        break;

                    case 'customer_support':
                        databaseResponse = '🆘 **Customer Support Contacts:**\n\n';
                        queryResult.data?.forEach((support: any, index: number) => {
                            databaseResponse += `**${index + 1}. ${support.support_type}** (${support.department})\n`;
                            databaseResponse += `   📞 ${support.contact_method}: ${support.contact_info}\n`;
                            databaseResponse += `   ⏰ Available: ${support.availability}\n`;
                            databaseResponse += `   ⚡ Response Time: ${support.response_time}\n`;
                            if (support.languages_supported) {
                                databaseResponse += `   🗣️ Languages: ${support.languages_supported}\n`;
                            }
                            databaseResponse += '\n';
                        });
                        break;

                    case 'specific_support':
                        databaseResponse = `🆘 **${queryResult.supportType || 'Specific Support'} Information:**\n\n`;
                        if (!queryResult.data || queryResult.data.length === 0) {
                            databaseResponse += '❌ No specific support method found matching your query.\n\n';
                            databaseResponse += '💡 Try asking for: "customer support info" to see all available methods.';
                        } else {
                            queryResult.data.forEach((support: any, index: number) => {
                                databaseResponse += `**${support.support_type}** (${support.department})\n`;
                                databaseResponse += `   📞 ${support.contact_method}: ${support.contact_info}\n`;
                                databaseResponse += `   ⏰ Available: ${support.availability}\n`;
                                databaseResponse += `   ⚡ Response Time: ${support.response_time}\n`;
                                if (support.languages_supported) {
                                    databaseResponse += `   🗣️ Languages: ${support.languages_supported}\n`;
                                }
                                databaseResponse += '\n';
                            });
                        }
                        break;

                    case 'support_topics':
                        databaseResponse = '📚 **Available Support Topics:**\n\n';
                        queryResult.data?.forEach((topic: any, index: number) => {
                            databaseResponse += `**${index + 1}. ${topic.topic_name}**\n`;
                            databaseResponse += `   📋 Description: ${topic.description}\n`;
                            if (topic.category) {
                                databaseResponse += `   🏷️ Category: ${topic.category}\n`;
                            }
                            databaseResponse += '\n';
                        });
                        break;

                    case 'product_categories':
                        databaseResponse = '🛍️ **Available Product Categories:**\n\n';
                        queryResult.data?.forEach((cat: any, index: number) => {
                            databaseResponse += `${index + 1}. ${cat.category}\n`;
                        });
                        databaseResponse += '\n💡 Ask about specific categories for product recommendations!';
                        break;

                    case 'order_statistics':
                        databaseResponse = '📊 **Order Statistics:**\n\n';
                        queryResult.data?.forEach((stat: any) => {
                            databaseResponse += `📦 **${stat.status}:** ${stat.count} orders (Avg: Rs.${Math.round(stat.avg_amount)})\n`;
                        });
                        break;

                    default:
                        databaseResponse = '🏪 **General Store Information:**\n\n';
                        databaseResponse += '• Product Catalog: 1,100+ items across multiple categories\n';
                        databaseResponse += '• Order Management: Complete tracking system\n';
                        databaseResponse += '• Customer Support: Multiple contact methods\n';
                        databaseResponse += '• Delivery Options: 5 different delivery methods\n';
                        databaseResponse += '• Return Policies: Category-specific policies\n';
                        databaseResponse += '• Payment Methods: Multiple secure options\n\n';
                        databaseResponse += '💡 Ask me about any specific information you need!';
                        break;
                }

                botReply = databaseResponse;
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
                const generalFaq = generalBestMatch as FAQ | undefined;

                if (generalFaq && generalFaq.answer) {
                    botReply = generalFaq.answer + "\n\nIs there anything specific about this policy you'd like me to explain further?";
                } else {
                    const generalFAQs = await searchFAQs(generalKeywords);
                    if (generalFAQs.length > 0) {
                        const firstGeneralFaq = generalFAQs[0] as FAQ;
                        botReply = firstGeneralFaq.answer + "\n\nIs there anything specific about this policy you'd like me to explain further?";
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

        // Generate enhanced response if using LLM
        let enhancedResponse = null;
        if (systemPrompt) {
            try {
                enhancedResponse = await callLLM({
                    systemPrompt,
                    userMessage: message,
                    context,
                    intent: intentResult.intent,
                    userPreferences: { responseStyle: 'friendly', technicalLevel: 'basic' }
                });
            } catch (error) {
                console.error('LLM Enhancement Error:', error);
            }
        }

        return NextResponse.json({
            reply: botReply || "I apologize, but I couldn't generate a proper response. Please try again.",
            intent: intentResult.intent,
            confidence: intentResult.confidence,
            sessionId,
            suggestions: enhancedResponse?.suggestions || [],
            followUpQuestions: enhancedResponse?.followUpQuestions || [],
            metadata: enhancedResponse?.metadata || {
                processingTime: Date.now() - Date.now(),
                dataSourcesUsed: ['database'],
                confidenceFactors: ['intent_match']
            }
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
}// Updated privacy settings
