import { SessionsClient } from '@google-cloud/dialogflow';

// Dialogflow client configuration
let sessionClient: SessionsClient;

try {
    sessionClient = new SessionsClient({
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
        projectId: process.env.DIALOGFLOW_PROJECT_ID,
    });
} catch (error) {
    console.warn('Dialogflow not configured, using fallback intent detection');
}

// Dialogflow intent detection
export async function detectIntentWithDialogflow(message: string): Promise<DialogflowResult> {
    if (!sessionClient || !process.env.DIALOGFLOW_PROJECT_ID) {
        throw new Error('Dialogflow not configured');
    }

    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const sessionPath = sessionClient.projectAgentSessionPath(
        process.env.DIALOGFLOW_PROJECT_ID,
        sessionId
    );

    try {
        const [response] = await sessionClient.detectIntent({
            session: sessionPath,
            queryInput: {
                text: {
                    text: message,
                    languageCode: 'en-US',
                },
            },
        });

        const result = response.queryResult;

        return {
            intent: mapDialogflowToCustomIntent(result?.intent?.displayName || ''),
            confidence: result?.intentDetectionConfidence || 0,
            parameters: extractParameters(result?.parameters),
            fulfillmentText: result?.fulfillmentText || '',
            originalIntent: result?.intent?.displayName || '',
            queryText: result?.queryText || message
        };

    } catch (error) {
        console.error('Dialogflow detection error:', error);
        throw error;
    }
}

// Map Dialogflow intents to your custom intent system
function mapDialogflowToCustomIntent(dialogflowIntent: string): string {
    const intentMapping: Record<string, string> = {
        // Order related
        'order.status': 'ORDER_STATUS',
        'order.items': 'ORDER_ITEMS',
        'order.details': 'ORDER_DETAILS',
        'order.track': 'ORDER_STATUS',
        'order.inquiry': 'ORDER_STATUS',

        // Support related - Map to specific intents  
        'support.general': 'SPECIFIC_SUPPORT',
        'support.whatsapp': 'SPECIFIC_SUPPORT',
        'support.phone': 'SPECIFIC_SUPPORT',
        'support.email': 'SPECIFIC_SUPPORT',
        'support.chat': 'SPECIFIC_SUPPORT',
        'support.technical': 'SPECIFIC_SUPPORT',
        'support.returns': 'RETURN_POLICIES',
        'customer.support': 'SPECIFIC_SUPPORT',

        // Delivery related
        'delivery.methods': 'DELIVERY_METHODS',
        'delivery.options': 'DELIVERY_METHODS',
        'shipping.methods': 'DELIVERY_METHODS',

        // Return policies
        'return.policies': 'RETURN_POLICIES',
        'return.process': 'RETURN_POLICIES',
        'refund.policy': 'RETURN_POLICIES',

        // Payment related
        'payment.methods': 'PAYMENT_METHODS',
        'payment.options': 'PAYMENT_METHODS',

        // Product recommendations
        'product.recommend': 'PRODUCT_RECOMMENDATION',
        'product.suggest': 'PRODUCT_RECOMMENDATION',

        // Database queries
        'data.query': 'DATABASE_QUERY',
        'info.request': 'DATABASE_QUERY',
        'promotion.info': 'DATABASE_QUERY',
        'shipping.zones': 'DATABASE_QUERY',

        // Warranty specific
        'warranty.info': 'WARRANTY_INFO',
        'warranty.policy': 'WARRANTY_INFO',
        'warranty.claim': 'WARRANTY_INFO',

        // Policy inquiries
        'policy.inquiry': 'POLICY',
        'policy.general': 'POLICY',

        // Default fallback
        'Default Fallback Intent': 'OTHER',
        '': 'OTHER'
    };

    return intentMapping[dialogflowIntent] || 'OTHER';
}

// Extract and format parameters from Dialogflow response
function extractParameters(parametersStruct: any): Record<string, any> {
    if (!parametersStruct?.fields) return {};

    const parameters: Record<string, any> = {};

    Object.keys(parametersStruct.fields).forEach(key => {
        const field = parametersStruct.fields[key];

        // Handle different parameter types
        if (field.stringValue) {
            parameters[key] = field.stringValue;
        } else if (field.numberValue !== undefined) {
            parameters[key] = field.numberValue;
        } else if (field.listValue) {
            parameters[key] = field.listValue.values?.map((v: any) =>
                v.stringValue || v.numberValue || v
            ) || [];
        } else if (field.structValue) {
            parameters[key] = field.structValue;
        }
    });

    return parameters;
}

// Enhanced entity extraction for your specific use cases
export function extractEntitiesFromDialogflow(
    parameters: Record<string, any>,
    message: string,
    originalIntent: string
): EntityExtractionResult {

    const entities: EntityExtractionResult = {
        orderId: null,
        supportType: null,
        productCategory: null,
        budget: null,
        priceRange: null
    };

    // Order ID extraction (match database format)
    if (parameters['order-id']) {
        // Remove any ORD prefix to match database format
        let extractedId = parameters['order-id'].toString().replace(/^ORD/i, '');
        entities.orderId = extractedId;
    } else {
        // Enhanced regex patterns for various order ID formats
        const patterns = [
            /(?:ORD|ORDER)[-\s]*(\d+)/i,  // ORD123, ORDER 123
            /\border\s+(\d+)/i,           // "order 1010"
            /\b(\d{4})\b/,                // Just 4-digit numbers
            /\b(\d{3,5})\b/               // 3-5 digit numbers
        ];

        for (const pattern of patterns) {
            const match = message.match(pattern);
            if (match && match[1]) {
                entities.orderId = match[1];
                break;
            }
        }
    }

    // Support type extraction
    if (parameters['support-type']) {
        entities.supportType = parameters['support-type'];
    } else if (originalIntent.includes('whatsapp')) {
        entities.supportType = 'whatsapp';
    } else if (originalIntent.includes('phone')) {
        entities.supportType = 'phone';
    } else if (originalIntent.includes('email')) {
        entities.supportType = 'email';
    } else if (originalIntent.includes('chat')) {
        entities.supportType = 'chat';
    } else if (originalIntent.includes('technical')) {
        entities.supportType = 'technical';
    }

    // Product category extraction
    if (parameters['product-category']) {
        entities.productCategory = parameters['product-category'];
    }

    // Budget/price range extraction
    if (parameters['budget'] || parameters['price-range']) {
        entities.budget = parameters['budget'] || parameters['price-range'];
    } else {
        // Fallback regex for price patterns
        const priceMatch = message.match(/(?:under|below|less than|up to)\s*(?:rs\.?\s*)?(\d+(?:,\d+)*)/i);
        if (priceMatch) {
            entities.budget = parseInt(priceMatch[1].replace(/,/g, ''));
        }
    }

    return entities;
}

// Type definitions
export interface DialogflowResult {
    intent: string;
    confidence: number;
    parameters: Record<string, any>;
    fulfillmentText: string;
    originalIntent: string;
    queryText: string;
}

export interface EntityExtractionResult {
    orderId: string | null;
    supportType: string | null;
    productCategory: string | null;
    budget: number | null;
    priceRange: string | null;
}

// Test connection to Dialogflow
export async function testDialogflowConnection(): Promise<boolean> {
    try {
        if (!sessionClient || !process.env.DIALOGFLOW_PROJECT_ID) {
            return false;
        }

        // Test with a simple message
        await detectIntentWithDialogflow("hello");
        return true;

    } catch (error) {
        console.error('Dialogflow connection test failed:', error);
        return false;
    }
}