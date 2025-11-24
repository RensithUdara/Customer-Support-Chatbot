// Intent detection logic
export type Intent = 'ORDER_STATUS' | 'POLICY' | 'PRODUCT_RECOMMENDATION' | 'OTHER';

export interface IntentResult {
    intent: Intent;
    confidence: number;
    extractedData?: {
        orderId?: number;
        category?: string;
        budget?: number;
        tags?: string[];
    };
}

// Rule-based intent detection
export const detectIntent = (message: string): IntentResult => {
    const lowercaseMessage = message.toLowerCase();

    // Extract numbers (potential order IDs)
    const numberMatch = message.match(/\b\d{4,6}\b/);
    const orderId = numberMatch ? parseInt(numberMatch[0]) : undefined;

    // Extract budget/price
    const budgetMatch = message.match(/(?:under|below|less than|within|budget|price)\s*(?:rs\.?\s*|Rs.\s*)?(\d+(?:,\d+)*)/i);
    const budget = budgetMatch ? parseInt(budgetMatch[1].replace(/,/g, '')) : undefined;

    // Order status keywords
    const orderKeywords = ['order', 'track', 'status', 'delivery', 'shipped', 'where is', 'when will'];
    const hasOrderKeywords = orderKeywords.some(keyword => lowercaseMessage.includes(keyword));

    // Policy/FAQ keywords
    const policyKeywords = ['return', 'refund', 'policy', 'shipping', 'delivery charge', 'cash on delivery', 'cod', 'warranty', 'exchange', 'payment', 'pay', 'emi', 'card', 'credit', 'debit', 'wallet', 'upi', 'invoice', 'fee', 'charge', 'secure', 'account', 'login', 'password', 'profile'];
    const hasPolicyKeywords = policyKeywords.some(keyword => lowercaseMessage.includes(keyword));

    // Product recommendation keywords
    const productKeywords = ['recommend', 'suggest', 'best', 'good', 'under', 'budget', 'cheap', 'phone', 'laptop', 'mobile'];
    const hasProductKeywords = productKeywords.some(keyword => lowercaseMessage.includes(keyword));

    // Category detection
    let category = '';
    const categories = ['mobile', 'phone', 'smartphone', 'laptop', 'computer', 'tablet', 'headphone', 'earphone', 'watch', 'gaming'];
    const foundCategory = categories.find(cat => lowercaseMessage.includes(cat));
    if (foundCategory) {
        category = foundCategory.includes('phone') || foundCategory.includes('mobile') ? 'mobile' : foundCategory;
    }

    // Tags detection
    const tags: string[] = [];
    const tagKeywords = ['gaming', 'office', 'student', 'professional', 'budget', 'premium', 'fast', 'lightweight'];
    tagKeywords.forEach(tag => {
        if (lowercaseMessage.includes(tag)) {
            tags.push(tag);
        }
    });

    // Determine intent
    if (hasOrderKeywords && orderId) {
        return {
            intent: 'ORDER_STATUS',
            confidence: 0.9,
            extractedData: { orderId }
        };
    }

    if (hasPolicyKeywords) {
        return {
            intent: 'POLICY',
            confidence: 0.8
        };
    }

    if (hasProductKeywords || budget) {
        return {
            intent: 'PRODUCT_RECOMMENDATION',
            confidence: 0.7,
            extractedData: { category, budget, tags }
        };
    }

    return {
        intent: 'OTHER',
        confidence: 0.3
    };
};

// Keywords for search
export const extractKeywords = (message: string): string[] => {
    const stopWords = ['the', 'is', 'at', 'which', 'on', 'and', 'a', 'to', 'are', 'as', 'what', 'how', 'can', 'do', 'i', 'my', 'you', 'your', 'offer', 'have'];

    // Special handling for important short keywords
    const specialKeywords = ['emi', 'cod', 'upi'];
    let keywords = message
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => (word.length > 2 && !stopWords.includes(word)) || specialKeywords.includes(word));

    // Add the special keywords if they appear in the message
    specialKeywords.forEach(special => {
        if (message.toLowerCase().includes(special) && !keywords.includes(special)) {
            keywords.push(special);
        }
    });

    return keywords;
};