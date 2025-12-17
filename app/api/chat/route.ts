import { NextRequest, NextResponse } from 'next/server';
import { detectIntent, detectIntentWithContext, extractKeywords, detectGreeting, extractNameFromMessage, detectGratitude, detectGoodbye, detectHelpRequest, detectConfused, detectYes, detectNo, detectApology, detectSmallTalk, detectOrderPlacement } from '@/lib/intent';
import { searchFAQs, getOrderById, searchProducts, saveConversation, getConversationHistory, searchBestFAQ, getDeliveryMethods, getReturnPolicies, getReturnPoliciesByCategory, getReturnFAQs, smartDatabaseQuery, saveOrder, getOrdersByCustomerEmail, getAllOrders } from '@/lib/db';
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

// Helper function to personalize responses with user's name
const personalizeResponse = (response: string, userNameParam?: string | null): string => {
    if (!userNameParam) return response;

    // Add friendly greeting with name at the start of response if it's a detailed response
    if (response.length > 100 && !response.includes(userNameParam)) {
        return `Hey ${userNameParam}! 👋\n\n${response}`;
    }

    // Add closing with user's name
    if (response.endsWith('!') || response.endsWith('?')) {
        return response + `\n\nIs there anything else I can help you with, ${userNameParam}? 😊`;
    }

    return response;
};

export async function POST(request: NextRequest) {
    try {
        const { message, sessionId = 'anonymous', userName = null, orderStep = 0, orderData = {} } = await request.json();

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        // Get recent conversation history for context
        const conversationHistory = await getConversationHistory(sessionId, 6); // Last 6 messages

        // Save user message to conversation history
        await saveConversation(sessionId, message, 'user');

        // Check if this is a greeting
        let isGreeting = detectGreeting(message);
        let extractedName: string | null = null;
        let intentResult = detectIntentWithContext(message, conversationHistory);

        // Check for conversational intents first (higher priority)
        if (isGreeting) {
            intentResult = {
                intent: 'GREETING',
                confidence: 0.95,
                extractedData: {}
            };
        } else if (detectGratitude(message)) {
            intentResult = {
                intent: 'GRATITUDE',
                confidence: 0.95,
                extractedData: {}
            };
        } else if (detectGoodbye(message)) {
            intentResult = {
                intent: 'GOODBYE',
                confidence: 0.95,
                extractedData: {}
            };
        } else if (detectApology(message)) {
            intentResult = {
                intent: 'APOLOGY',
                confidence: 0.9,
                extractedData: {}
            };
        } else if (orderStep > 0) {
            // If we're in the middle of order placement, continue that process
            intentResult = {
                intent: 'ORDER_PLACEMENT',
                confidence: 0.9,
                extractedData: { orderStep }
            };
        } else if (detectOrderPlacement(message) && orderStep === 0) {
            // User explicitly initiated order placement (NOT when asking about existing orders)
            intentResult = {
                intent: 'ORDER_PLACEMENT',
                confidence: 0.95,
                extractedData: { orderStep: 1 }
            };
        } else if (detectSmallTalk(message)) {
            intentResult = {
                intent: 'SMALLTALK',
                confidence: 0.9,
                extractedData: {}
            };
        } else if (detectConfused(message)) {
            intentResult = {
                intent: 'CONFUSED',
                confidence: 0.85,
                extractedData: {}
            };
        } else if (detectHelpRequest(message)) {
            intentResult = {
                intent: 'HELP',
                confidence: 0.85,
                extractedData: {}
            };
        } else if (detectYes(message)) {
            intentResult = {
                intent: 'YES',
                confidence: 0.95,
                extractedData: {}
            };
        } else if (detectNo(message)) {
            intentResult = {
                intent: 'NO',
                confidence: 0.95,
                extractedData: {}
            };
        } else {
            // Try to extract name from message in case user provides their name
            extractedName = extractNameFromMessage(message);
        }

        console.log('Intent detected:', intentResult);

        let botReply = '';
        let systemPrompt = '';
        let context: any = {};

        switch (intentResult.intent) {
            case 'GREETING':
                // Handle greeting - ask for name if not provided
                if (userName) {
                    // User already provided name, use friendly greeting
                    botReply = `👋 Hi ${userName}! How can I help you today?\n\n` +
                        `I'm here to assist you with:\n` +
                        `📦 **Order Tracking** - Check your order status\n` +
                        `🛍️ **Product Recommendations** - Find what you need\n` +
                        `❓ **FAQs & Policies** - Get answers to common questions\n` +
                        `📞 **Support** - Connect with our team\n\n` +
                        `What can I do for you, ${userName}?`;
                } else {
                    // First time greeting, ask for name
                    botReply = `👋 Hi! Welcome to ShopEasy! 😊\n\n` +
                        `I'm your friendly AI assistant here to help you with:\n` +
                        `📦 Order tracking & status updates\n` +
                        `🛍️ Product recommendations\n` +
                        `❓ FAQs & policies\n` +
                        `📞 Customer support\n\n` +
                        `Before we get started, **what's your name?** 🤝`;
                }
                break;

            case 'GRATITUDE':
                // Handle thank you/gratitude responses
                if (userName) {
                    botReply = `😊 You're very welcome, ${userName}! I'm always happy to help!\n\n` +
                        `Is there anything else I can assist you with today? Feel free to ask about:\n` +
                        `📦 Orders and tracking\n` +
                        `🛍️ Product recommendations\n` +
                        `❓ Policies and FAQs\n` +
                        `📞 Support services\n\n` +
                        `Just let me know! 🤝`;
                } else {
                    botReply = `😊 You're very welcome! I'm always happy to help!\n\n` +
                        `Is there anything else I can assist you with today? Feel free to ask about:\n` +
                        `📦 Orders and tracking\n` +
                        `🛍️ Product recommendations\n` +
                        `❓ Policies and FAQs\n` +
                        `📞 Support services\n\n` +
                        `Just let me know! 🤝`;
                }
                break;

            case 'GOODBYE':
                // Handle goodbye/farewell responses
                if (userName) {
                    botReply = `👋 Goodbye, ${userName}! It was great chatting with you!\n\n` +
                        `Thank you for choosing ShopEasy. Have a wonderful day! 😊\n\n` +
                        `Feel free to come back anytime you need help. We're here 24/7! 🎉`;
                } else {
                    botReply = `👋 Goodbye! It was great chatting with you!\n\n` +
                        `Thank you for choosing ShopEasy. Have a wonderful day! 😊\n\n` +
                        `Feel free to come back anytime you need help. We're here 24/7! 🎉`;
                }
                break;

            case 'APOLOGY':
                // Handle apologies
                botReply = `No problem at all! 😊\n\n` +
                    `Don't worry - I'm here to help make things easy for you! There's no need to apologize.\n\n` +
                    `Let's get back on track. How can I assist you today?\n` +
                    `📦 Track an order\n` +
                    `🛍️ Find a product\n` +
                    `❓ Answer a question\n` +
                    `📞 Get support\n\n` +
                    `What would you like help with? 🤝`;
                break;

            case 'CONFUSED':
                // Handle confusion/not understanding
                if (userName) {
                    botReply = `No worries, ${userName}! I'm here to clarify! 😊\n\n` +
                        `I understand it can sometimes be confusing. Let me break it down for you:\n\n` +
                        `**How can I help clarify?**\n` +
                        `🎯 **Track Order** - I can find your order status with a 4-digit order number\n` +
                        `🎯 **Find Products** - Tell me what you're looking for and your budget\n` +
                        `🎯 **Policies** - Ask about returns, shipping, payments, warranty\n` +
                        `🎯 **Support** - Need to speak with someone? I can connect you\n\n` +
                        `Feel free to ask me anything, and I'll explain it clearly! 💡`;
                } else {
                    botReply = `No worries! I'm here to clarify! 😊\n\n` +
                        `I understand it can sometimes be confusing. Let me help you out:\n\n` +
                        `**How can I help?**\n` +
                        `🎯 **Track Order** - Give me a 4-digit order number\n` +
                        `🎯 **Find Products** - Tell me what you want and your budget\n` +
                        `🎯 **Ask Questions** - About returns, shipping, payments, warranty\n` +
                        `🎯 **Get Support** - Connect with our team\n\n` +
                        `Feel free to ask anything, and I'll explain it clearly! 💡`;
                }
                break;

            case 'HELP':
                // Handle help requests
                if (userName) {
                    botReply = `Of course, ${userName}! I'm here to help! 💪\n\n` +
                        `I can assist you with:\n\n` +
                        `📦 **Order Tracking** - Check status, tracking number, delivery time\n` +
                        `🛍️ **Product Search** - Find products in your budget\n` +
                        `❓ **Policies & FAQs** - Returns, shipping, payment options, warranty\n` +
                        `💡 **Expert Advice** - EMI options, product recommendations\n` +
                        `📞 **Customer Support** - Direct contact information\n\n` +
                        `What do you need help with, ${userName}? Just tell me and I'll take care of it! 🎯`;
                } else {
                    botReply = `Of course! I'm here to help! 💪\n\n` +
                        `I can assist you with:\n\n` +
                        `📦 **Order Tracking** - Check status and delivery info\n` +
                        `🛍️ **Product Search** - Find what you need\n` +
                        `❓ **Policies & FAQs** - Get answers to your questions\n` +
                        `💡 **Expert Advice** - Recommendations and tips\n` +
                        `📞 **Customer Support** - Contact information\n\n` +
                        `What do you need help with? Let me know! 🎯`;
                }
                break;

            case 'SMALLTALK':
                // Handle small talk
                const responses = [
                    `I'm doing great, thanks for asking! 😊 I'm always here and ready to help you with anything you need. How can I make your day better?`,
                    `Doing wonderful! 🌟 Thanks for the friendly chat! So, what brings you here today? Can I help you with an order, product search, or anything else?`,
                    `I appreciate you asking! 😄 I'm here 24/7 to make sure you have the best experience. What can I help you with today?`,
                    `All good here! 👍 Just excited to help awesome customers like you! What's on your mind? Any orders, questions, or products you're looking for?`
                ];
                botReply = responses[Math.floor(Math.random() * responses.length)];
                break;

            case 'YES':
                // Handle affirmative responses (usually in context of a question)
                botReply = `Awesome! 🎉 That's great to hear!\n\n` +
                    `So what would you like to do next?\n` +
                    `📦 Track an order\n` +
                    `🛍️ Browse products\n` +
                    `❓ Ask a question\n` +
                    `📞 Get support\n\n` +
                    `I'm all ears! 👂`;
                break;

            case 'NO':
                // Handle negative responses
                botReply = `No problem! That's completely fine. 😊\n\n` +
                    `Let me know if there's anything else I can help you with:\n` +
                    `📦 Track an order\n` +
                    `🛍️ Find products\n` +
                    `❓ Ask questions\n` +
                    `📞 Get support\n\n` +
                    `Just say the word! 🤝`;
                break;

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
                                itemsInfo + (userName ? `\n\n✨ Hope you're excited about this order, ${userName}!` : '');
                        } else {
                            // Show basic tracking information only (privacy-safe)
                            botReply = `📦 **Order #${order.orderId}** - ${order.status}\n\n` +
                                `🚚 **Tracking Number:** ${order.trackingNumber}\n` +
                                `📅 **Order Date:** ${order.orderDate}\n` +
                                `📦 **Estimated Delivery:** ${order.estimatedDelivery}\n\n` +
                                `💡 Ask for "order details" if you need more information.` + (userName ? `\n\n${userName}, let me know if you need anything else! 😊` : '');
                        }
                    } else {
                        botReply = "I couldn't find that order number. Please double-check your order ID and try again, or contact our support team for assistance.";
                    }
                } else {
                    botReply = `I'd be happy to help you track your order${userName ? `, ${userName}` : ''}! Could you please provide your order number? It's usually a 4-digit number like 1001 or 1015.`;
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

                deliveryMethodsText += (userName ? `💡 ${userName}, choose the method that best suits your needs!` : '💡 Choose the method that best suits your needs!');
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

                returnPolicyText += (userName ? `\n💡 ${userName}, need more help? Contact our support team!` : '\n💡 Need more help? Contact our support team!');
                botReply = returnPolicyText;
                break;

            case 'POLICY':
                // Return exact database answer for policy questions
                const keywords = extractKeywords(message);
                const bestMatch = await searchBestFAQ(message, keywords);
                const policyFaq = bestMatch as FAQ | undefined;

                if (policyFaq && policyFaq.answer) {
                    botReply = policyFaq.answer + (userName ? `\n\n${userName}, is there anything specific about this policy you'd like me to explain further?` : "\n\nIs there anything specific about this policy you'd like me to explain further?");
                } else {
                    // Fallback to general search
                    const relevantFAQs = await searchFAQs(keywords);
                    if (relevantFAQs.length > 0) {
                        const firstFaq = relevantFAQs[0] as FAQ;
                        botReply = firstFaq.answer + (userName ? `\n\n${userName}, is there anything specific about this policy you'd like me to explain further?` : "\n\nIs there anything specific about this policy you'd like me to explain further?");
                    } else {
                        botReply = `I'd be happy to help you with policy information${userName ? `, ${userName}` : ''}. Could you please be more specific about what you'd like to know about our shipping, returns, payments, or other policies?`;
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

            case 'ORDER_PLACEMENT': {
                const currentStep = intentResult.extractedData?.orderStep || orderStep || 1;
                let newOrderData: any = { ...orderData };
                let nextStep = currentStep;

                if (currentStep === 1) {
                    const extractedName = extractNameFromMessage(message);
                    if (extractedName) {
                        newOrderData.name = extractedName;
                        nextStep = 2;
                        botReply = `✅ Name: **${extractedName}**\n\n📧 Email address?`;
                    } else {
                        botReply = `👤 What's your **name**?`;
                    }
                } else if (currentStep === 2) {
                    const emailPattern = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/i;
                    const emailMatch = message.match(emailPattern);
                    if (emailMatch) {
                        newOrderData.email = emailMatch[1];
                        nextStep = 3;
                        botReply = `✅ Email: **${emailMatch[1]}**\n\n📞 Phone number?`;
                    } else {
                        botReply = `📧 Please provide a valid **email address**`;
                    }
                } else if (currentStep === 3) {
                    const phonePattern = /[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/;
                    const phoneMatch = message.match(phonePattern);
                    if (phoneMatch) {
                        newOrderData.phone = phoneMatch[0];
                        nextStep = 4;
                        botReply = `✅ Phone: **${phoneMatch[0]}**\n\n🏠 Delivery address?`;
                    } else {
                        botReply = `📞 Please provide a valid **phone number**`;
                    }
                } else if (currentStep === 4) {
                    newOrderData.address = message.substring(0, 150);
                    nextStep = 5;
                    botReply = `✅ Address saved!\n\n🛍️ Product name?`;
                } else if (currentStep === 5) {
                    newOrderData.productName = message.substring(0, 100);
                    nextStep = 6;
                    botReply = `✅ Product: **${newOrderData.productName}**\n\n📦 Quantity?`;
                } else if (currentStep === 6) {
                    const quantityMatch = message.match(/\d+/);
                    if (quantityMatch && parseInt(quantityMatch[0]) > 0) {
                        newOrderData.quantity = parseInt(quantityMatch[0]);
                        nextStep = 7;
                        botReply = `✅ Quantity: **${newOrderData.quantity}**\n\n💳 Payment method?\n1️⃣ Credit Card\n2️⃣ Debit Card\n3️⃣ COD\n4️⃣ Wallet`;
                    } else {
                        botReply = `📦 Please enter a valid **quantity**`;
                    }
                } else if (currentStep === 7) {
                    const paymentLower = message.toLowerCase();
                    let paymentMethod = '';
                    if (paymentLower.includes('credit') || message === '1') paymentMethod = 'Credit Card';
                    else if (paymentLower.includes('debit') || message === '2') paymentMethod = 'Debit Card';
                    else if (paymentLower.includes('cod') || message === '3') paymentMethod = 'Cash on Delivery';
                    else if (paymentLower.includes('wallet') || message === '4') paymentMethod = 'Mobile Wallet';

                    if (paymentMethod) {
                        newOrderData.paymentMethod = paymentMethod;
                        nextStep = 8;
                        botReply = `✅ Payment: **${paymentMethod}**\n\n🚚 Delivery method?\n1️⃣ Standard (5-7 days)\n2️⃣ Express (2-3 days)\n3️⃣ Overnight`;
                    } else {
                        botReply = `💳 Please choose a valid **payment method**`;
                    }
                } else if (currentStep === 8) {
                    const deliveryLower = message.toLowerCase();
                    let deliveryMethod = '';
                    if (deliveryLower.includes('standard') || message === '1') deliveryMethod = 'Standard (5-7 days)';
                    else if (deliveryLower.includes('express') || message === '2') deliveryMethod = 'Express (2-3 days)';
                    else if (deliveryLower.includes('overnight') || message === '3') deliveryMethod = 'Overnight';

                    if (deliveryMethod) {
                        newOrderData.deliveryMethod = deliveryMethod;
                        nextStep = 9;
                        botReply = `✅ Delivery: **${deliveryMethod}**\n\n📋 **SUMMARY:**\n👤 Name: **${newOrderData.name}**\n📧 Email: **${newOrderData.email}**\n📞 Phone: **${newOrderData.phone}**\n🛍️ Product: **${newOrderData.productName}** (${newOrderData.quantity}x)\n💳 Payment: **${newOrderData.paymentMethod}**\n🚚 Delivery: **${deliveryMethod}**\n\n✅ Confirm? (yes/no)`;
                    } else {
                        botReply = `🚚 Please choose a valid **delivery method**`;
                    }
                } else if (currentStep === 9) {
                    if (message.toLowerCase().includes('yes')) {
                        // Save order to database with all customer information
                        try {
                            const orderResult = saveOrder({
                                customerName: newOrderData.name || '',
                                customerEmail: newOrderData.email || '',
                                customerPhone: newOrderData.phone || '',
                                shippingAddress: newOrderData.address || '',
                                productName: newOrderData.productName || '',
                                quantity: newOrderData.quantity || 1,
                                paymentMethod: newOrderData.paymentMethod || '',
                                deliveryMethod: newOrderData.deliveryMethod || ''
                            });

                            if (orderResult.success) {
                                const orderId = orderResult.orderId;
                                botReply = `🎉 **ORDER CONFIRMED!**\n\n📦 **Order #${orderId}**\n✅ Status: Processing\n📧 Confirmation sent to **${newOrderData.email}**\n🚚 Delivery: **${newOrderData.deliveryMethod}**\n📞 Total Amount: **PKR ${(newOrderData.quantity * 5000 + (newOrderData.deliveryMethod.includes('Standard') ? 200 : newOrderData.deliveryMethod.includes('Express') ? 500 : 1000))}**\n\nThank you! 🙏`;
                            } else {
                                botReply = `❌ Error saving order. Please try again.`;
                            }
                        } catch (error) {
                            console.error('Order placement error:', error);
                            botReply = `❌ Error processing order: ${error instanceof Error ? error.message : 'Unknown error'}`;
                        }
                        nextStep = 0;
                    } else {
                        botReply = `❌ Order cancelled.`;
                        nextStep = 0;
                    }
                }

                context.orderData = newOrderData;
                context.nextOrderStep = nextStep;
                break;
            }

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

        // Generate AI response if using LLM
        let aiResponse = null;
        if (systemPrompt) {
            try {
                aiResponse = await callLLM({
                    systemPrompt,
                    userMessage: message,
                    context,
                    intent: intentResult.intent,
                    userPreferences: { responseStyle: 'friendly', technicalLevel: 'basic' }
                });
            } catch (error) {
                console.error('LLM Processing Error:', error);
            }
        }

        return NextResponse.json({
            reply: botReply || "I apologize, but I couldn't generate a proper response. Please try again.",
            intent: intentResult.intent,
            confidence: intentResult.confidence,
            sessionId,
            extractedName: extractedName,
            orderStep: context.nextOrderStep,
            orderData: context.orderData,
            suggestions: aiResponse?.suggestions || [],
            followUpQuestions: aiResponse?.followUpQuestions || [],
            metadata: aiResponse?.metadata || {
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
