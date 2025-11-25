import { smartDatabaseQuery } from './db';

// Enhanced database query handler for Dialogflow integration
export class DatabaseQueryHandler {

    // Handle order status queries with enhanced lookup
    static async handleOrderStatus(orderId: string, message: string): Promise<string> {
        try {
            // Try multiple order ID formats
            const orderFormats = [
                orderId,
                orderId.replace(/^ORD/i, ''),
                `ORD${orderId}`,
                orderId.padStart(4, '0'),
            ];

            let orderData = null;
            let foundOrderId = '';

            for (const format of orderFormats) {
                const result = smartDatabaseQuery(`order status for order ${format}`);
                if (result.data && result.data.length > 0) {
                    orderData = result.data[0];
                    foundOrderId = format;
                    break;
                }
            }

            if (orderData) {
                return this.formatOrderStatusResponse(orderData, foundOrderId, message);
            }

            return this.getOrderNotFoundResponse(orderId);

        } catch (error) {
            console.error('Order status query error:', error);
            return "I'm having trouble accessing order information right now. Please try again or contact our support team.";
        }
    }

    // Handle database queries based on Dialogflow parameters
    static async handleDatabaseQuery(message: string, dialogflowData?: any): Promise<string> {
        try {
            const queryResult = smartDatabaseQuery(message);

            if (!queryResult || !queryResult.data) {
                return this.getNoResultsResponse(message);
            }

            return this.formatDatabaseResponse(queryResult, message);

        } catch (error) {
            console.error('Database query error:', error);
            return "I'm having trouble accessing that information right now. Please try again.";
        }
    }

    // Handle warranty queries with category detection
    static async handleWarrantyQuery(message: string, category?: string): Promise<string> {
        const detectedCategory = category || this.extractWarrantyCategory(message);

        let warrantyQuery = 'warranty information';
        if (detectedCategory) {
            warrantyQuery = `warranty for ${detectedCategory} products`;
        }

        const result = smartDatabaseQuery(warrantyQuery);

        if (result.type === 'warranty' && result.data.length > 0) {
            return this.formatWarrantyResponse(result.data, detectedCategory, message);
        }

        return this.getGenericWarrantyResponse();
    }

    // Handle support queries with specific type detection
    static async handleSupportQuery(message: string, supportType?: string): Promise<string> {
        const detectedType = supportType || this.extractSupportType(message);

        const supportQuery = detectedType ?
            `${detectedType} support contact information` :
            'customer support information';

        const result = smartDatabaseQuery(supportQuery);

        if (result.type === 'customer_support' || result.type === 'specific_support') {
            return this.formatSupportResponse(result.data, detectedType);
        }

        return this.getGenericSupportResponse(detectedType);
    }

    // Private formatting methods
    private static formatOrderStatusResponse(order: any, orderId: string, message: string): string {
        const isDetailedRequest = message.toLowerCase().includes('detail') ||
            message.toLowerCase().includes('information') ||
            message.toLowerCase().includes('full');

        if (isDetailedRequest) {
            return `📦 **Order #${orderId}** - ${order.status || order.order_status}\n\n` +
                `👤 **Customer:** ${order.customerName || order.customer_name}\n` +
                `📅 **Order Date:** ${order.orderDate || order.order_date}\n` +
                `💰 **Total Amount:** Rs.${(order.totalAmount || order.total_amount)?.toLocaleString()}\n` +
                `💳 **Payment Method:** ${order.paymentMethod || order.payment_method}\n` +
                `🚚 **Tracking Number:** ${order.trackingNumber || order.tracking_number}\n` +
                `📦 **Estimated Delivery:** ${order.estimatedDelivery || order.estimated_delivery || 'Processing'}`;
        } else {
            return `📦 **Order #${orderId}** - ${order.status || order.order_status}\n\n` +
                `🚚 **Tracking:** ${order.trackingNumber || order.tracking_number || 'Pending'}\n` +
                `📅 **Order Date:** ${order.orderDate || order.order_date}\n` +
                `📦 **Est. Delivery:** ${order.estimatedDelivery || order.estimated_delivery || 'Processing'}\n\n` +
                `💡 Ask for "order details" for more information.`;
        }
    }

    private static formatDatabaseResponse(queryResult: any, originalMessage: string): string {
        switch (queryResult.type) {
            case 'payment_methods':
                return this.formatPaymentMethods(queryResult.data);
            case 'warranty':
                return this.formatWarrantyData(queryResult.data);
            case 'shipping_zones':
                return this.formatShippingZones(queryResult.data);
            case 'promotions':
                return this.formatPromotions(queryResult.data);
            case 'customer_support':
                return this.formatCustomerSupport(queryResult.data);
            case 'product_categories':
                return this.formatProductCategories(queryResult.data);
            default:
                return this.formatGenericResponse(queryResult.data, originalMessage);
        }
    }

    private static formatWarrantyResponse(warrantyData: any[], category?: string, originalMessage?: string): string {
        if (category) {
            const specificWarranty = warrantyData.find(w =>
                w.product_category?.toLowerCase().includes(category.toLowerCase())
            );

            if (specificWarranty) {
                return `🛡️ **${specificWarranty.product_category} Warranty**\n\n` +
                    `⏰ **Period:** ${specificWarranty.warranty_period}\n` +
                    `📋 **Coverage:** ${specificWarranty.coverage || specificWarranty.description}\n` +
                    `🔄 **How to Claim:** ${specificWarranty.claim_process}\n` +
                    `❌ **Exclusions:** ${specificWarranty.exclusions || 'Standard exclusions apply'}\n` +
                    `📞 **Contact:** ${specificWarranty.contact_info}\n\n` +
                    `💡 Keep your purchase receipt safe for warranty claims!`;
            }
        }

        // General warranty information
        let response = '🛡️ **Warranty Policies**\n\n';
        warrantyData.forEach((warranty, index) => {
            response += `**${index + 1}. ${warranty.product_category}**\n`;
            response += `   ⏰ Period: ${warranty.warranty_period} months\n`;
            response += `   📋 Coverage: ${warranty.coverage_details}\n\n`;
        });

        if (category) {
            response += `💡 Couldn't find specific ${category} warranty. Contact support for details.`;
        } else {
            response += `💡 Ask about specific product warranties for detailed information!`;
        }

        return response;
    }

    private static formatSupportResponse(supportData: any[], supportType?: string): string {
        let relevantSupport = supportData[0]; // Default to first

        if (supportType && supportData.length > 1) {
            relevantSupport = supportData.find(s =>
                s.support_type?.toLowerCase().includes(supportType.toLowerCase()) ||
                s.department?.toLowerCase().includes(supportType.toLowerCase())
            ) || supportData[0];
        }

        if (relevantSupport) {
            return `📞 **${relevantSupport.support_type} Support**\n\n` +
                `• **Contact:** ${relevantSupport.contact_info}\n` +
                `• **Method:** ${relevantSupport.contact_method}\n` +
                `• **Hours:** ${relevantSupport.availability}\n` +
                `• **Response Time:** ${relevantSupport.response_time}\n` +
                `• **Department:** ${relevantSupport.department}\n\n` +
                `💡 Contact us for immediate assistance!`;
        }

        return this.getGenericSupportResponse(supportType);
    }

    // Utility methods for formatting different data types
    private static formatPaymentMethods(data: any[]): string {
        let response = '💳 **Available Payment Methods**\n\n';
        data.forEach((method, index) => {
            response += `**${index + 1}. ${method.type}** (${method.provider})\n`;
            response += `   💰 Fee: ${method.processing_fee}% | ⚡ Time: ${method.processing_time}\n\n`;
        });
        return response;
    }

    private static formatWarrantyData(data: any[]): string {
        let response = '🛡️ **Warranty Information**\n\n';
        data.forEach((warranty, index) => {
            response += `**${index + 1}. ${warranty.product_category}:** ${warranty.warranty_period}\n`;
            response += `   📋 Coverage: ${warranty.coverage || warranty.description}\n`;
            if (warranty.claim_process) {
                response += `   🔄 Claim Process: ${warranty.claim_process}\n`;
            }
            if (warranty.contact_info) {
                response += `   📞 Contact: ${warranty.contact_info}\n`;
            }
            response += '\n';
        });
        response += '💡 Ask about specific product warranties for detailed information!';
        return response;
    }

    private static formatShippingZones(data: any[]): string {
        let response = '📍 **Shipping Zones**\n\n';
        data.forEach((zone, index) => {
            response += `**${index + 1}. ${zone.zone_name}**\n`;
            response += `   🌍 ${zone.regions} | 💰 Rs.${zone.standard_cost} | ⏱️ ${zone.standard_delivery_days} days\n\n`;
        });
        return response;
    }

    private static formatPromotions(data: any[]): string {
        let response = '🎉 **Current Promotions**\n\n';
        data.forEach((promo, index) => {
            response += `**${index + 1}. ${promo.promo_name}** (${promo.promo_code})\n`;
            response += `   💰 ${promo.discount_percentage}% off | 📅 Until ${promo.end_date}\n\n`;
        });
        return response;
    }

    private static formatCustomerSupport(data: any[]): string {
        let response = '🆘 **Customer Support**\n\n';
        data.forEach((support, index) => {
            response += `**${index + 1}. ${support.support_type}**\n`;
            response += `   📞 ${support.contact_info} | ⏰ ${support.availability}\n\n`;
        });
        return response;
    }

    private static formatProductCategories(data: any[]): string {
        let response = '🛍️ **Product Categories**\n\n';
        data.forEach((cat, index) => {
            response += `${index + 1}. ${cat.category || cat.name}\n`;
        });
        return response + '\n💡 Ask about specific categories for recommendations!';
    }

    private static formatGenericResponse(data: any[], originalMessage: string): string {
        if (!data || data.length === 0) {
            return `I couldn't find specific information about "${originalMessage}". Please try rephrasing your question or contact our support team.`;
        }

        return `📋 **Information Found (${data.length} items)**\n\n` +
            data.slice(0, 5).map((item, index) => {
                const keys = Object.keys(item);
                const primaryKey = keys.find(k => k.includes('name')) || keys[0];
                return `${index + 1}. ${item[primaryKey]}`;
            }).join('\n') +
            (data.length > 5 ? `\n\n💡 Showing first 5 of ${data.length} results.` : '');
    }

    // Helper methods for category and type extraction
    private static extractWarrantyCategory(message: string): string | null {
        const categoryMap = {
            'computers': ['computer', 'laptop', 'pc', 'desktop'],
            'smartphones': ['phone', 'mobile', 'smartphone', 'cell'],
            'electronics': ['electronics', 'electronic'],
            'tablets': ['tablet', 'ipad'],
            'watches': ['watch', 'smartwatch', 'wearable']
        };

        const lowerMessage = message.toLowerCase();
        for (const [category, keywords] of Object.entries(categoryMap)) {
            if (keywords.some(keyword => lowerMessage.includes(keyword))) {
                return category;
            }
        }

        return null;
    }

    private static extractSupportType(message: string): string | null {
        const supportTypes = ['whatsapp', 'phone', 'email', 'chat', 'technical'];
        const lowerMessage = message.toLowerCase();

        return supportTypes.find(type => lowerMessage.includes(type)) || null;
    }

    // Fallback responses
    private static getOrderNotFoundResponse(orderId: string): string {
        return `❌ I couldn't find order "${orderId}". Please check:\n\n` +
            `• Order ID format (usually 4 digits like 1001)\n` +
            `• Spelling and numbers\n` +
            `• Contact support if you need help: 📞 +94 11 234 5678`;
    }

    private static getNoResultsResponse(query: string): string {
        return `🔍 No specific information found for "${query}".\n\n` +
            `Try asking about:\n` +
            `• Order status (with order number)\n` +
            `• Product warranties\n` +
            `• Payment methods\n` +
            `• Return policies\n` +
            `• Customer support\n\n` +
            `💬 Or contact our support team for assistance!`;
    }

    private static getGenericWarrantyResponse(): string {
        return `🛡️ **General Warranty Information**\n\n` +
            `• Computer & Laptops: 24 months\n` +
            `• Smartphones: 12 months\n` +
            `• Electronics: 12-24 months\n` +
            `• Tablets: 12 months\n\n` +
            `💡 Ask about specific product warranties for detailed coverage information.`;
    }

    private static getGenericSupportResponse(supportType?: string): string {
        return `📞 **Customer Support**\n\n` +
            `We're here to help${supportType ? ` with ${supportType} support` : ''}!\n\n` +
            `• 💬 Chat: You're already connected!\n` +
            `• 📞 Phone: During business hours\n` +
            `• 📧 Email: 24/7 support\n\n` +
            `How can we assist you today?`;
    }

    // Handle order items queries - show what products are in an order
    static async handleOrderItems(orderId: string, message: string): Promise<string> {
        try {
            // Try multiple order ID formats
            const orderFormats = [
                orderId,
                orderId.replace(/^ORD/i, ''),
                `ORD${orderId}`,
                orderId.padStart(4, '0'),
            ];

            let orderData = null;
            let foundOrderId = '';

            for (const format of orderFormats) {
                const result = smartDatabaseQuery(`order items for order ${format}`);
                if (result.data && result.data.length > 0) {
                    orderData = result.data[0];
                    foundOrderId = format;
                    break;
                }
            }

            if (orderData) {
                return this.formatOrderItemsResponse(orderData, foundOrderId);
            }

            // Fallback: try to get basic order info and format as items
            for (const format of orderFormats) {
                const result = smartDatabaseQuery(`order status for order ${format}`);
                if (result.data && result.data.length > 0) {
                    orderData = result.data[0];
                    foundOrderId = format;
                    return this.formatBasicOrderItemsResponse(orderData, foundOrderId);
                }
            }

            return this.getOrderNotFoundResponse(orderId);

        } catch (error) {
            console.error('Order items query error:', error);
            return "I'm having trouble accessing order item information right now. Please try again or contact our support team.";
        }
    }

    // Handle order details queries - show comprehensive order information
    static async handleOrderDetails(orderId: string, message: string): Promise<string> {
        try {
            // Try multiple order ID formats
            const orderFormats = [
                orderId,
                orderId.replace(/^ORD/i, ''),
                `ORD${orderId}`,
                orderId.padStart(4, '0'),
            ];

            let orderData = null;
            let foundOrderId = '';

            for (const format of orderFormats) {
                const result = smartDatabaseQuery(`order details for order ${format}`);
                if (result.data && result.data.length > 0) {
                    orderData = result.data[0];
                    foundOrderId = format;
                    break;
                }
            }

            if (orderData) {
                return this.formatOrderDetailsResponse(orderData, foundOrderId);
            }

            return this.getOrderNotFoundResponse(orderId);

        } catch (error) {
            console.error('Order details query error:', error);
            return "I'm having trouble accessing detailed order information right now. Please try again or contact our support team.";
        }
    }

    // Format response for order items
    private static formatOrderItemsResponse(orderData: any, orderId: string): string {
        const items = orderData.items || orderData.order_items || orderData.products;
        
        if (items && Array.isArray(items)) {
            let response = `📦 **Items in Order #${orderId}**\n\n`;
            
            items.forEach((item: any, index: number) => {
                response += `${index + 1}. **${item.product_name || item.name}**\n`;
                response += `   • Quantity: ${item.quantity || 1}\n`;
                response += `   • Price: Rs.${(item.price || item.unit_price || 0).toLocaleString()}\n`;
                if (item.variant || item.size || item.color) {
                    response += `   • Variant: ${item.variant || item.size || item.color}\n`;
                }
                response += `\n`;
            });

            const totalAmount = orderData.totalAmount || orderData.total_amount;
            if (totalAmount) {
                response += `💰 **Total:** Rs.${totalAmount.toLocaleString()}\n`;
            }

            return response;
        } else {
            return this.formatBasicOrderItemsResponse(orderData, orderId);
        }
    }

    // Format basic order items when detailed items aren't available
    private static formatBasicOrderItemsResponse(orderData: any, orderId: string): string {
        return `📦 **Order #${orderId} Items**\n\n` +
            `⚠️ Detailed item list not available, but here's what I can show:\n\n` +
            `💰 **Total Amount:** Rs.${(orderData.totalAmount || orderData.total_amount || 0).toLocaleString()}\n` +
            `📅 **Order Date:** ${orderData.orderDate || orderData.order_date || 'Unknown'}\n` +
            `🎯 **Status:** ${orderData.status || orderData.order_status || 'Unknown'}\n\n` +
            `💡 Contact support for detailed item breakdown: ${orderId}`;
    }

    // Format comprehensive order details
    private static formatOrderDetailsResponse(orderData: any, orderId: string): string {
        let response = `📋 **Complete Order Details - #${orderId}**\n\n`;
        
        // Basic order info
        response += `🎯 **Status:** ${orderData.status || orderData.order_status || 'Unknown'}\n`;
        response += `👤 **Customer:** ${orderData.customerName || orderData.customer_name || 'N/A'}\n`;
        response += `📅 **Order Date:** ${orderData.orderDate || orderData.order_date || 'Unknown'}\n`;
        response += `💰 **Total Amount:** Rs.${(orderData.totalAmount || orderData.total_amount || 0).toLocaleString()}\n`;
        response += `💳 **Payment Method:** ${orderData.paymentMethod || orderData.payment_method || 'N/A'}\n\n`;
        
        // Shipping info
        response += `🚚 **Shipping Information:**\n`;
        response += `   • Tracking Number: ${orderData.trackingNumber || orderData.tracking_number || 'Pending'}\n`;
        response += `   • Estimated Delivery: ${orderData.estimatedDelivery || orderData.estimated_delivery || 'Processing'}\n`;
        response += `   • Shipping Address: ${orderData.shippingAddress || orderData.shipping_address || 'On file'}\n\n`;
        
        // Items if available
        const items = orderData.items || orderData.order_items || orderData.products;
        if (items && Array.isArray(items)) {
            response += `📦 **Order Items:**\n`;
            items.forEach((item: any, index: number) => {
                response += `   ${index + 1}. ${item.product_name || item.name} (Qty: ${item.quantity || 1})\n`;
            });
        }
        
        return response;
    }
}