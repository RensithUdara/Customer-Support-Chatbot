import { smartDatabaseQuery } from './db';

// Dynamic response generator using database queries
export class ResponseGenerator {

    // Generate warranty response from database
    static async generateWarrantyResponse(message: string, category?: string): Promise<string> {
        const lowercaseMessage = message.toLowerCase();

        // Detect category from message if not provided
        const detectedCategory = category || this.detectWarrantyCategory(lowercaseMessage);

        // Query database for warranty information
        const warrantyQuery = detectedCategory ?
            `warranty information for ${detectedCategory}` :
            'all warranty policies';

        const queryResult = smartDatabaseQuery(warrantyQuery);

        if (queryResult.type === 'warranty' && queryResult.data.length > 0) {
            return this.formatWarrantyResponse(queryResult.data, detectedCategory);
        }

        // Fallback to general warranty info
        return this.getGeneralWarrantyResponse();
    }

    // Generate support response from database
    static async generateSupportResponse(supportType: string): Promise<string> {
        const supportQuery = `${supportType} support contact information`;
        const queryResult = smartDatabaseQuery(supportQuery);

        if (queryResult.type === 'customer_support' && queryResult.data.length > 0) {
            return this.formatSupportResponse(queryResult.data, supportType);
        }

        return this.getDefaultSupportResponse(supportType);
    }

    // Generate payment methods response from database
    static async generatePaymentMethodsResponse(): Promise<string> {
        const queryResult = smartDatabaseQuery('payment methods information');

        if (queryResult.type === 'payment_methods' && queryResult.data.length > 0) {
            return this.formatPaymentMethodsResponse(queryResult.data);
        }

        return 'Payment methods information is currently unavailable. Please contact support.';
    }

    // Generate delivery methods response from database
    static async generateDeliveryMethodsResponse(): Promise<string> {
        const queryResult = smartDatabaseQuery('delivery methods and shipping options');

        if (queryResult.data && queryResult.data.length > 0) {
            return this.formatDeliveryMethodsResponse(queryResult.data);
        }

        return 'Delivery methods information is currently unavailable. Please contact support.';
    }

    // Generate return policies response from database
    static async generateReturnPoliciesResponse(message: string): Promise<string> {
        const category = this.detectReturnCategory(message);
        const returnQuery = category ?
            `return policy for ${category} products` :
            'general return policies';

        const queryResult = smartDatabaseQuery(returnQuery);

        if (queryResult.data && queryResult.data.length > 0) {
            return this.formatReturnPoliciesResponse(queryResult.data, category);
        }

        return 'Return policy information is currently unavailable. Please contact support.';
    }

    // Private helper methods
    private static detectWarrantyCategory(message: string): string | null {
        const categories = {
            'computers': ['computer', 'laptop', 'pc', 'desktop'],
            'smartphones': ['phone', 'mobile', 'smartphone', 'cell'],
            'electronics': ['electronics', 'electronic', 'gadget'],
            'tablets': ['tablet', 'ipad'],
            'watches': ['watch', 'smartwatch', 'wearable']
        };

        for (const [category, keywords] of Object.entries(categories)) {
            if (keywords.some(keyword => message.includes(keyword))) {
                return category;
            }
        }

        return null;
    }

    private static detectReturnCategory(message: string): string | null {
        const categories = ['electronics', 'fashion', 'home', 'kitchen', 'sports', 'toys', 'health', 'books', 'beauty'];
        return categories.find(cat => message.toLowerCase().includes(cat)) || null;
    }

    private static formatWarrantyResponse(warrantyData: any[], category?: string): string {
        if (!warrantyData || warrantyData.length === 0) {
            return this.getGeneralWarrantyResponse();
        }

        if (category) {
            // Find specific category warranty
            const specificWarranty = warrantyData.find(w =>
                w.product_category?.toLowerCase().includes(category.toLowerCase())
            );

            if (specificWarranty) {
                return `🛡️ **${specificWarranty.product_category} Warranty**\n\n` +
                    `⏰ **Period:** ${specificWarranty.warranty_period}\n` +
                    `📋 **Coverage:** ${specificWarranty.coverage || specificWarranty.description}\n` +
                    `🔄 **Claim Process:** ${specificWarranty.claim_process}\n` +
                    `❌ **Exclusions:** ${specificWarranty.exclusions || 'Standard exclusions apply'}\n` +
                    `📞 **Contact:** ${specificWarranty.contact_info}\n\n` +
                    `💡 Keep your purchase receipt for warranty claims!`;
            }
        }

        // General warranty overview
        let response = '🛡️ **Warranty Information**\n\n';
        warrantyData.forEach((warranty, index) => {
            response += `**${index + 1}. ${warranty.product_category}**\n`;
            response += `   ⏰ Period: ${warranty.warranty_period}\n`;
            response += `   📋 Coverage: ${warranty.coverage || warranty.description}\n\n`;
        });

        response += '💡 Ask about specific product warranties for detailed information!';
        return response;
    }

    private static formatSupportResponse(supportData: any[], supportType: string): string {
        const relevantSupport = supportData.find(s =>
            s.support_type?.toLowerCase().includes(supportType.toLowerCase())
        ) || supportData[0];

        if (relevantSupport) {
            return `📞 **${relevantSupport.support_type} Support**\n\n` +
                `• **Contact:** ${relevantSupport.contact_info}\n` +
                `• **Method:** ${relevantSupport.contact_method}\n` +
                `• **Hours:** ${relevantSupport.availability}\n` +
                `• **Response Time:** ${relevantSupport.response_time}\n` +
                `• **Department:** ${relevantSupport.department}\n\n` +
                `💡 Contact us for immediate assistance!`;
        }

        return this.getDefaultSupportResponse(supportType);
    }

    // Generate payment methods response
    static async generatePaymentMethodsResponse(): Promise<string> {
        const queryResult = smartDatabaseQuery('payment methods');

        if (queryResult.type === 'payment_methods' && queryResult.data.length > 0) {
            let response = '💳 **Available Payment Methods:**\n\n';
            queryResult.data.forEach((method: any, index: number) => {
                response += `**${index + 1}. ${method.type}** (${method.provider})\n`;
                response += `   💰 Processing Fee: ${method.processing_fee}%\n`;
                response += `   ⚡ Processing Time: ${method.processing_time}\n`;
                if (method.features) {
                    response += `   ✨ Features: ${method.features}\n`;
                }
                response += '\n';
            });
            return response;
        }

        return '💳 **Available Payment Methods:**\n\n' +
            '• Credit/Debit Cards (Visa, MasterCard)\n' +
            '• Digital Wallets (PayPal, Google Pay)\n' +
            '• Bank Transfer\n' +
            '• Cash on Delivery\n\n' +
            '💡 All payments are secured with SSL encryption!';
    }

    // Generate delivery methods response
    static async generateDeliveryMethodsResponse(): Promise<string> {
        const queryResult = smartDatabaseQuery('delivery methods');

        if (queryResult.type === 'delivery_methods' && queryResult.data.length > 0) {
            let response = '🚚 **Available Delivery Methods:**\n\n';
            queryResult.data.forEach((method: any, index: number) => {
                response += `**${index + 1}. ${method.method}** (${method.provider})\n`;
                response += `   📍 Coverage: ${method.coverage_area}\n`;
                response += `   ⏱️ Delivery Time: ${method.delivery_time}\n`;
                response += `   💰 Cost: Rs.${method.cost}\n`;
                response += `   📦 Weight Limit: ${method.weight_limit}kg\n`;
                response += `   🚚 Tracking: ${method.tracking_available ? 'Yes' : 'No'}\n`;
                response += `   💵 COD Available: ${method.cod_available ? 'Yes' : 'No'}\n`;
                if (method.insurance_included) {
                    response += `   🛡️ Insurance: Included\n`;
                }
                response += '\n';
            });
            response += '💡 Choose the method that best suits your needs!';
            return response;
        }

        return '🚚 **Available Delivery Methods:**\n\n' +
            '• Standard Delivery (3-5 days)\n' +
            '• Express Delivery (1-2 days)\n' +
            '• Same Day Delivery (Colombo Metro)\n' +
            '• Free Delivery (orders above Rs. 10,000)\n\n' +
            '💡 Choose the method that best suits your needs!';
    }

    // Generate return policies response
    static async generateReturnPoliciesResponse(message: string): Promise<string> {
        const categories = ['electronics', 'fashion', 'home', 'kitchen', 'sports', 'toys', 'health', 'books', 'beauty'];
        const messageWords = message.toLowerCase().split(' ');
        const foundCategory = categories.find(cat => messageWords.some(word => word.includes(cat)));

        const queryResult = smartDatabaseQuery(foundCategory ? `return policy ${foundCategory}` : 'return policies');

        if (queryResult.type === 'return_policies' && queryResult.data.length > 0) {
            let response = foundCategory ?
                `📋 **Return Policy for ${foundCategory.charAt(0).toUpperCase() + foundCategory.slice(1)} Products:**\n\n` :
                '📋 **Return Policy Summary:**\n\n';

            queryResult.data.forEach((policy: any) => {
                if (foundCategory) {
                    response += `⏰ **Return Period:** ${policy.return_period} days\n`;
                    response += `📦 **Condition Required:** ${policy.condition_required}\n`;
                    response += `🚚 **Return Shipping:** ${policy.return_shipping}\n`;
                    response += `💰 **Refund Method:** ${policy.refund_method}\n`;
                    response += `⚡ **Processing Time:** ${policy.processing_time} days\n`;
                    response += `🔄 **Exchange:** ${policy.exchange_allowed ? 'Available' : 'Not Available'}\n`;
                } else {
                    response += `• **${policy.product_category}:** ${policy.return_period} days - ${policy.condition_required}\n`;
                }
            });

            response += '\n💡 Need more help? Contact our support team!';
            return response;
        }

        return '📋 **Return Policy:**\n\n' +
            '• 14-day return window\n' +
            '• Items must be unused and in original packaging\n' +
            '• Return shipping varies by category\n\n' +
            '💡 Contact support for specific category details!';
    }

    // Generate policy response (for general policy questions)
    static async generatePolicyResponse(message: string): Promise<string> {
        const queryResult = smartDatabaseQuery(`policy ${message}`);

        if (queryResult.data && queryResult.data.length > 0) {
            // If we found FAQ data, return the first relevant answer
            const firstResult = queryResult.data[0];
            if (firstResult.answer) {
                return firstResult.answer + "\n\nIs there anything specific about this policy you'd like me to explain further?";
            }
        }

        return "I'd be happy to help you with policy information. Could you please be more specific about what you'd like to know about our shipping, returns, payments, or other policies?";
    }

    // Dynamic response dispatcher
    static async generateDynamicResponse(intent: string, message: string, extractedData?: any, dialogflowData?: any): Promise<string> {
        try {
            switch (intent) {
                case 'WARRANTY_INFO':
                    return await this.generateWarrantyResponse(message, extractedData?.category);
                case 'SPECIFIC_SUPPORT':
                    return await this.generateSupportResponse(extractedData?.supportType || 'general');
                case 'PAYMENT_METHODS':
                    return await this.generatePaymentMethodsResponse();
                case 'DELIVERY_METHODS':
                    return await this.generateDeliveryMethodsResponse();
                case 'RETURN_POLICIES':
                    return await this.generateReturnPoliciesResponse(message);
                case 'POLICY':
                    return await this.generatePolicyResponse(message);
                default:
                    // For any unhandled intent, try FAQ search
                    const queryResult = smartDatabaseQuery(message);
                    if (queryResult.data && queryResult.data.length > 0 && queryResult.data[0].answer) {
                        return queryResult.data[0].answer;
                    }

                    return "Hello! I'm here to help you with:\n\n" +
                        "🔍 **Order Tracking** - Check your order status\n" +
                        "📋 **Policies & FAQs** - Return policy, shipping, payments, warranty\n" +
                        "🛍️ **Product Recommendations** - Find products based on your needs\n\n" +
                        "How can I assist you today?";
            }
        } catch (error) {
            console.error(`Error generating ${intent} response:`, error);
            return `I apologize, but I'm having trouble accessing information right now. Please try again or contact our support team.`;
        }
    }

    private static formatPaymentMethodsResponse(paymentData: any[]): string {
        let response = '💳 **Available Payment Methods**\n\n';

        paymentData.forEach((method, index) => {
            response += `**${index + 1}. ${method.type}** (${method.provider})\n`;
            response += `   💰 Processing Fee: ${method.processing_fee}%\n`;
            response += `   ⚡ Processing Time: ${method.processing_time}\n`;
            if (method.features) {
                response += `   ✨ Features: ${method.features}\n`;
            }
            response += '\n';
        });

        response += '💡 All payments are secured with SSL encryption!';
        return response;
    }

    private static formatDeliveryMethodsResponse(deliveryData: any[]): string {
        let response = '🚚 **Available Delivery Methods**\n\n';

        deliveryData.forEach((method, index) => {
            response += `**${index + 1}. ${method.method || method.delivery_method}** (${method.provider})\n`;
            response += `   📍 Coverage: ${method.coverage_area}\n`;
            response += `   ⏱️ Delivery Time: ${method.delivery_time}\n`;
            response += `   💰 Cost: Rs.${method.cost}\n`;
            response += `   📦 Weight Limit: ${method.weight_limit}kg\n`;
            response += `   🚚 Tracking: ${method.tracking_available ? 'Yes' : 'No'}\n`;
            response += `   💵 COD: ${method.cod_available ? 'Available' : 'Not Available'}\n\n`;
        });

        response += '💡 Choose the method that best suits your needs!';
        return response;
    }

    private static formatReturnPoliciesResponse(returnData: any[], category?: string): string {
        if (category) {
            const categoryPolicy = returnData.find(p =>
                p.product_category?.toLowerCase().includes(category.toLowerCase())
            );

            if (categoryPolicy) {
                return `📋 **Return Policy for ${categoryPolicy.product_category}**\n\n` +
                    `⏰ **Return Period:** ${categoryPolicy.return_period} days\n` +
                    `📦 **Condition:** ${categoryPolicy.condition_required}\n` +
                    `🚚 **Return Shipping:** ${categoryPolicy.return_shipping}\n` +
                    `💰 **Refund Method:** ${categoryPolicy.refund_method}\n` +
                    `⚡ **Processing Time:** ${categoryPolicy.processing_time} days\n` +
                    `🔄 **Exchange:** ${categoryPolicy.exchange_allowed ? 'Available' : 'Not Available'}\n\n` +
                    `💡 Contact support for assistance with returns!`;
            }
        }

        // General return policies
        let response = '📋 **Return Policy Summary**\n\n';
        returnData.forEach((policy) => {
            if (policy.return_period > 0) {
                response += `• **${policy.product_category}:** ${policy.return_period} days - ${policy.condition_required}\n`;
            }
        });

        response += '\n💡 Ask about specific category return policies for detailed information!';
        return response;
    }

    private static getGeneralWarrantyResponse(): string {
        return `🛡️ **Product Warranty Information**\n\n` +
            `**Standard Warranty Periods:**\n` +
            `• Computers & Laptops: 24 months\n` +
            `• Smartphones: 12 months\n` +
            `• Electronics: 12-24 months\n` +
            `• Tablets: 12 months\n` +
            `• Watches: 6-12 months\n\n` +
            `**For specific warranty details, ask about:**\n` +
            `• "Computer warranty"\n` +
            `• "Phone warranty"\n` +
            `• "Electronics warranty"\n\n` +
            `📞 **General Warranty Support:** Contact our support team`;
    }

    private static getDefaultSupportResponse(supportType: string): string {
        return `📞 **${supportType.charAt(0).toUpperCase() + supportType.slice(1)} Support**\n\n` +
            `We're here to help! Our ${supportType} support team is available to assist you.\n\n` +
            `💡 Contact our general support line for immediate assistance:\n` +
            `📞 Phone: Available during business hours\n` +
            `💬 Chat: You're already connected!\n\n` +
            `How can we help you today?`;
    }
}

