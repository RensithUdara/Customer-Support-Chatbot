// Intent detection logic
export type Intent = 'GREETING' | 'GRATITUDE' | 'GOODBYE' | 'HELP' | 'CONFUSED' | 'YES' | 'NO' | 'APOLOGY' | 'SMALLTALK' | 'ORDER_PLACEMENT' | 'ORDER_STATUS' | 'POLICY' | 'PRODUCT_RECOMMENDATION' | 'DELIVERY_METHODS' | 'RETURN_POLICIES' | 'DATABASE_QUERY' | 'OTHER';

export interface IntentResult {
    intent: Intent;
    confidence: number;
    extractedData?: {
        orderId?: number;
        category?: string;
        budget?: number;
        tags?: string[];
        orderStep?: number;
    };
}

// Context-aware intent detection
export const detectIntentWithContext = (message: string, conversationHistory: any[] = []): IntentResult => {
    const basicIntent = detectIntent(message);

    // Enhance intent detection with conversation context
    if (conversationHistory.length > 0) {
        const recentMessages = conversationHistory.slice(-3); // Last 3 messages

        // Check if user is continuing a previous conversation
        const lastBotMessage = recentMessages.find(msg => msg.sender === 'bot');
        if (lastBotMessage) {
            const botContent = lastBotMessage.message.toLowerCase();

            // If bot mentioned products and user gives a short response, likely product-related
            if (botContent.includes('product') || botContent.includes('acer') || botContent.includes('laptop')) {
                if (message.length < 20 && (message.toLowerCase().includes('yes') ||
                    message.toLowerCase().includes('more') || message.toLowerCase().includes('details'))) {
                    return {
                        intent: 'PRODUCT_RECOMMENDATION',
                        confidence: 0.8,
                        extractedData: { category: 'continuing_conversation' }
                    };
                }
            }

            // If bot mentioned order and user gives order-related response
            if (botContent.includes('order') && message.match(/\d{4}/)) {
                return {
                    intent: 'ORDER_STATUS',
                    confidence: 0.9,
                    extractedData: { orderId: parseInt(message.match(/\d{4}/)![0]) }
                };
            }
        }
    }

    return basicIntent;
};

// Greeting detection
export const detectGreeting = (message: string): boolean => {
    const lowercaseMessage = message.toLowerCase().trim();
    const greetingKeywords = ['hi', 'hello', 'hey', 'hola', 'greetings', 'wassup', 'whats up', "what's up", 'sup', 'good morning', 'good afternoon', 'good evening'];
    return greetingKeywords.some(keyword => lowercaseMessage === keyword || lowercaseMessage.startsWith(keyword + ' '));
};

// Gratitude/Thank you detection
export const detectGratitude = (message: string): boolean => {
    const lowercaseMessage = message.toLowerCase().trim();
    const gratitudeKeywords = ['thank you', 'thanks', 'thankyou', 'appreciate', 'appreciate it', 'thx', 'ty', 'tks', 'thanks so much', 'thank you so much', 'much appreciated', 'very grateful', 'grateful', 'cheers'];
    return gratitudeKeywords.some(keyword => lowercaseMessage === keyword || lowercaseMessage.includes(keyword));
};

// Goodbye detection
export const detectGoodbye = (message: string): boolean => {
    const lowercaseMessage = message.toLowerCase().trim();
    const goodbyeKeywords = ['bye', 'goodbye', 'farewell', 'see you', 'see you later', 'ttyl', 'talk soon', 'take care', 'catch you', 'gotta go', 'have to go', 'bye bye', 'see ya', 'adios'];
    return goodbyeKeywords.some(keyword => lowercaseMessage === keyword || lowercaseMessage.startsWith(keyword));
};

// Help request detection
export const detectHelpRequest = (message: string): boolean => {
    const lowercaseMessage = message.toLowerCase();
    const helpKeywords = ['help', 'assist', 'support', 'can you help', 'help me', 'i need help', 'please help', 'stuck', 'confused', 'lost', 'don\'t know', 'not sure'];
    return helpKeywords.some(keyword => lowercaseMessage.includes(keyword));
};

// Confused/Not understanding detection
export const detectConfused = (message: string): boolean => {
    const lowercaseMessage = message.toLowerCase();
    const confusedKeywords = ['confused', 'don\'t understand', 'dont understand', 'what do you mean', 'i don\'t get', 'not clear', 'unclear', 'explain', 'what is', 'what\'s', 'how do i', 'how can i', 'pardon', 'sorry what'];
    return confusedKeywords.some(keyword => lowercaseMessage.includes(keyword));
};

// Yes/Affirmative detection
export const detectYes = (message: string): boolean => {
    const lowercaseMessage = message.toLowerCase().trim();
    const yesKeywords = ['yes', 'yeah', 'yep', 'yup', 'sure', 'okay', 'ok', 'alright', 'correct', 'that\'s right', 'right', 'affirmative', 'indeed', 'absolutely', 'definitely'];
    return yesKeywords.some(keyword => lowercaseMessage === keyword || lowercaseMessage.startsWith(keyword));
};

// No/Negative detection
export const detectNo = (message: string): boolean => {
    const lowercaseMessage = message.toLowerCase().trim();
    const noKeywords = ['no', 'nope', 'nah', 'not really', 'negative', 'i don\'t', 'dont', 'don\'t think so', 'not sure', 'probably not', 'definitely not'];
    return noKeywords.some(keyword => lowercaseMessage === keyword || lowercaseMessage.startsWith(keyword));
};

// Apology detection
export const detectApology = (message: string): boolean => {
    const lowercaseMessage = message.toLowerCase();
    const apologyKeywords = ['sorry', 'apologize', 'my bad', 'my apologies', 'excuse me', 'pardon', 'oops', 'i\'m sorry', 'im sorry', 'my mistake'];
    return apologyKeywords.some(keyword => lowercaseMessage.includes(keyword));
};

// Small talk detection (weather, how are you, etc.)
export const detectSmallTalk = (message: string): boolean => {
    const lowercaseMessage = message.toLowerCase();
    const smallTalkKeywords = ['how are you', 'how\'s it', 'how is it', 'how\'re you', 'what\'s up', 'what is up', 'how\'s your day', 'how are things', 'how\'s everything', 'nice day', 'weather', 'you doing', 'you up to'];
    return smallTalkKeywords.some(keyword => lowercaseMessage.includes(keyword));
};

// Order placement detection - only for PLACING new orders, not checking existing ones
export const detectOrderPlacement = (message: string): boolean => {
    const lowercaseMessage = message.toLowerCase();

    // Product categories that indicate order placement
    const productKeywords = ['phone', 'mobile', 'laptop', 'notebook', 'computer', 'tablet', 'ipad', 'smartwatch', 'watch', 'headphones', 'earbuds', 'speakers', 'camera', 'monitor', 'keyboard', 'mouse', 'charger'];

    // Order intent phrases
    const placeOrderKeywords = ['place order', 'want to order', 'i want to buy', 'i would like to order', 'can i order', 'i want to purchase', 'make a purchase', 'place a purchase', 'new order', 'ready to order', 'need to buy', 'i need'];

    // Exclude phrases that indicate checking existing orders
    const excludeKeywords = ['where is', 'what is', 'status', 'track', 'when will', 'when is', 'how long'];
    const isExcluded = excludeKeywords.some(keyword => lowercaseMessage.includes(keyword));

    // Match if it has explicit order intent OR (product keyword AND buy/need intent)
    const hasOrderIntent = placeOrderKeywords.some(keyword => lowercaseMessage.includes(keyword));
    const hasProductAndBuyIntent = productKeywords.some(keyword => lowercaseMessage.includes(keyword)) &&
        (lowercaseMessage.includes('buy') || lowercaseMessage.includes('need') || lowercaseMessage.includes('purchase') || lowercaseMessage.includes('want'));

    return (hasOrderIntent || hasProductAndBuyIntent) && !isExcluded;
};

// Detect product category from message
export const detectProductCategory = (message: string): string | null => {
    const lowercaseMessage = message.toLowerCase();

    const categoryMappings: { [key: string]: string } = {
        'phone': 'Phones',
        'mobile': 'Phones',
        'smartphone': 'Phones',
        'laptop': 'Laptops',
        'notebook': 'Laptops',
        'computer': 'Computers',
        'desktop': 'Computers',
        'tablet': 'Tablets',
        'ipad': 'Tablets',
        'smartwatch': 'Wearables',
        'watch': 'Wearables',
        'headphones': 'Audio',
        'earbuds': 'Audio',
        'speakers': 'Audio',
        'camera': 'Cameras',
        'monitor': 'Monitors',
        'keyboard': 'Accessories',
        'mouse': 'Accessories',
        'charger': 'Accessories'
    };

    for (const [keyword, category] of Object.entries(categoryMappings)) {
        if (lowercaseMessage.includes(keyword)) {
            return category;
        }
    }

    return null;
};

// Extract name from message (e.g., "Hi, I'm John" or "My name is Sarah")
export const extractNameFromMessage = (message: string): string | null => {
    // Pattern for "I'm [name]"
    const iamPattern = /i'm\s+([a-zA-Z]+)/i;
    const iamMatch = message.match(iamPattern);
    if (iamMatch) return iamMatch[1];

    // Pattern for "I am [name]"
    const iamPattern2 = /i\s+am\s+([a-zA-Z]+)/i;
    const iamMatch2 = message.match(iamPattern2);
    if (iamMatch2) return iamMatch2[1];

    // Pattern for "My name is [name]"
    const myNamePattern = /my\s+name\s+is\s+([a-zA-Z]+)/i;
    const myNameMatch = message.match(myNamePattern);
    if (myNameMatch) return myNameMatch[1];

    // Pattern for "It's [name]" or "It is [name]"
    const itsPattern = /it(?:\'s|\s+is)\s+([a-zA-Z]+)/i;
    const itsMatch = message.match(itsPattern);
    if (itsMatch) return itsMatch[1];

    // If message is just a single word or name
    if (message.length <= 20 && /^[a-zA-Z\s'-]+$/.test(message)) {
        const words = message.trim().split(/\s+/);
        if (words.length === 1 || (words.length === 2 && words[0].toLowerCase() === 'name')) {
            return words[words.length - 1];
        }
    }

    return null;
};

// Rule-based intent detection
export const detectIntent = (message: string): IntentResult => {
    const lowercaseMessage = message.toLowerCase().trim();

    // Check conversation patterns FIRST - these take priority over product/order queries
    if (detectGreeting(message)) {
        return {
            intent: 'GREETING',
            confidence: 0.95,
            extractedData: {}
        };
    }

    if (detectGratitude(message)) {
        return {
            intent: 'GRATITUDE',
            confidence: 0.95,
            extractedData: {}
        };
    }

    if (detectGoodbye(message)) {
        return {
            intent: 'GOODBYE',
            confidence: 0.95,
            extractedData: {}
        };
    }

    if (detectHelpRequest(message)) {
        return {
            intent: 'HELP',
            confidence: 0.9,
            extractedData: {}
        };
    }

    if (detectYes(message)) {
        return {
            intent: 'YES',
            confidence: 0.9,
            extractedData: {}
        };
    }

    if (detectNo(message)) {
        return {
            intent: 'NO',
            confidence: 0.9,
            extractedData: {}
        };
    }

    if (detectConfused(message)) {
        return {
            intent: 'CONFUSED',
            confidence: 0.85,
            extractedData: {}
        };
    }

    if (detectApology(message)) {
        return {
            intent: 'APOLOGY',
            confidence: 0.9,
            extractedData: {}
        };
    }

    if (detectSmallTalk(message)) {
        return {
            intent: 'SMALLTALK',
            confidence: 0.8,
            extractedData: {}
        };
    }

    // Extract numbers (potential order IDs)
    const numberMatch = message.match(/\b\d{4,6}\b/);
    const orderId = numberMatch ? parseInt(numberMatch[0]) : undefined;

    // Extract budget/price
    const budgetMatch = message.match(/(?:under|below|less than|within|budget|price)\s*(?:rs\.?\s*|Rs.\s*)?(\d+(?:,\d+)*)/i);
    const budget = budgetMatch ? parseInt(budgetMatch[1].replace(/,/g, '')) : undefined;

    // Order status keywords
    const orderKeywords = ['order', 'track', 'status', 'delivery', 'shipped', 'where is', 'when will'];
    const hasOrderKeywords = orderKeywords.some(keyword => lowercaseMessage.includes(keyword));

    // Delivery methods keywords (specific queries about delivery options)
    const deliveryMethodKeywords = ['delivery methods', 'shipping methods', 'delivery options', 'shipping options', 'how do you deliver', 'what delivery', 'available delivery', 'delivery types', 'shipping types'];
    const hasDeliveryMethodKeywords = deliveryMethodKeywords.some(keyword => lowercaseMessage.includes(keyword));

    // Return policies keywords (specific queries about return policies)
    const returnPolicyKeywords = ['return policy', 'return policies', 'refund policy', 'refund policies', 'exchange policy', 'return procedure', 'how to return', 'return process', 'return rules', 'return conditions', 'return for electronics', 'return for fashion', 'return for books', 'return for home', 'return electronics', 'return fashion', 'return items', 'returning'];
    const hasReturnPolicyKeywords = returnPolicyKeywords.some(keyword => lowercaseMessage.includes(keyword));

    // Also check if it's a category-specific return question
    const returnCategories = ['electronics', 'fashion', 'home', 'kitchen', 'sports', 'toys', 'health', 'books', 'beauty'];
    const hasReturnCategoryQuery = returnCategories.some(cat =>
        lowercaseMessage.includes('return') && lowercaseMessage.includes(cat)
    );

    // Database query keywords (questions about data/information)
    const databaseQueryKeywords = [
        'how many', 'what are', 'list all', 'show me', 'tell me about', 'information about',
        'details about', 'all products', 'all orders', 'customer support', 'contact info',
        'support topics', 'warranty', 'promotions', 'shipping zones', 'payment methods',
        'available products', 'product categories', 'support contact', 'warranty policy',
        'current promotions', 'active promotions', 'payment options', 'shipping areas',
        'what payment', 'show payment', 'payment types', 'payment ways', 'ways to pay',
        'show warranty', 'warranty info', 'show promotions', 'current offers',
        'shipping options', 'delivery zones', 'support info', 'contact details',
        'whatsapp support', 'phone support', 'email support', 'live chat', 'technical support',
        'returns support', 'whatsapp contact', 'phone contact', 'email contact', 'chat support'
    ];
    const hasDatabaseQueryKeywords = databaseQueryKeywords.some(keyword => lowercaseMessage.includes(keyword));

    // Policy/FAQ keywords
    const policyKeywords = ['return', 'refund', 'policy', 'shipping', 'delivery charge', 'cash on delivery', 'cod', 'warranty', 'exchange', 'payment', 'pay', 'emi', 'card', 'credit', 'debit', 'wallet', 'upi', 'invoice', 'fee', 'charge', 'secure', 'account', 'login', 'password', 'profile'];
    const hasPolicyKeywords = policyKeywords.some(keyword => lowercaseMessage.includes(keyword));

    // Advanced Product recommendation detection
    const productKeywords = ['recommend', 'suggest', 'best', 'good', 'under', 'budget', 'cheap', 'phone', 'laptop', 'mobile'];
    const hasProductKeywords = productKeywords.some(keyword => lowercaseMessage.includes(keyword));

    // Brand name detection - Common tech brands
    const brandNames = [
        'acer', 'asus', 'hp', 'dell', 'lenovo', 'apple', 'samsung', 'lg', 'sony',
        'microsoft', 'huawei', 'xiaomi', 'oppo', 'vivo', 'oneplus', 'realme',
        'intel', 'amd', 'nvidia', 'canon', 'nikon', 'jbl', 'bose', 'beats',
        'logitech', 'razer', 'corsair', 'kingston', 'seagate', 'wd', 'toshiba'
    ];
    const hasBrandName = brandNames.some(brand => lowercaseMessage.includes(brand));

    // Product model/type detection - Common product identifiers
    const productTypes = [
        'inspiron', 'pavilion', 'thinkpad', 'macbook', 'iphone', 'galaxy', 'pixel',
        'ryzen', 'core', 'gtx', 'rtx', 'pro', 'max', 'ultra', 'gaming', 'office',
        'student', 'business', 'home', 'professional', 'premium', 'budget'
    ];
    const hasProductType = productTypes.some(type => lowercaseMessage.includes(type));

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

    // Determine intent - Product recommendation should be checked BEFORE order status
    // This prevents budget amounts from being confused with order IDs
    if (hasProductKeywords && (budget || foundCategory || hasBrandName || hasProductType)) {
        // This is clearly a product recommendation query
        let confidence = 0.8;
        if (budget) confidence = 0.95; // High confidence when budget is specified
        if (hasBrandName || hasProductType) confidence = 0.9;

        return {
            intent: 'PRODUCT_RECOMMENDATION',
            confidence,
            extractedData: { category: foundCategory || 'general', budget, tags }
        };
    }

    // Order status detection - but only for 4-digit numbers (typical order IDs), not large numbers
    if (hasOrderKeywords && orderId && orderId >= 1000 && orderId <= 9999) {
        return {
            intent: 'ORDER_STATUS',
            confidence: 0.9,
            extractedData: { orderId }
        };
    }

    if (hasDeliveryMethodKeywords) {
        return {
            intent: 'DELIVERY_METHODS',
            confidence: 0.9
        };
    }

    if (hasReturnPolicyKeywords || hasReturnCategoryQuery) {
        return {
            intent: 'RETURN_POLICIES',
            confidence: 0.9
        };
    }

    if (hasDatabaseQueryKeywords) {
        return {
            intent: 'DATABASE_QUERY',
            confidence: 0.8
        };
    }

    if (hasPolicyKeywords) {
        return {
            intent: 'POLICY',
            confidence: 0.8
        };
    }

    // Advanced product recommendation detection
    if (hasProductKeywords || budget || hasBrandName || hasProductType || foundCategory) {
        let confidence = 0.7;

        // Higher confidence for brand names or specific product types
        if (hasBrandName) confidence = 0.9;
        if (hasProductType) confidence = Math.max(confidence, 0.8);
        if (foundCategory) confidence = Math.max(confidence, 0.75);

        return {
            intent: 'PRODUCT_RECOMMENDATION',
            confidence: confidence,
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

    // Delivery-related keyword mapping for better FAQ matching
    const deliveryKeywordMapping: { [key: string]: string[] } = {
        'international': ['ship internationally', 'international shipping', 'overseas'],
        'express': ['express shipping', 'fast delivery', 'urgent'],
        'same day': ['same-day delivery', 'today'],
        'bulk': ['bulk delivery', 'wholesale', 'large orders'],
        'schedule': ['delivery time', 'time slot'],
        'charge': ['shipping charges', 'delivery cost', 'fees'],
        'address': ['delivery address', 'shipping address', 'change address'],
        'home': ['not home', 'absent', 'redelivery'],
        'track': ['delivery updates', 'tracking', 'status']
    };

    let message_lower = message.toLowerCase();
    let additionalKeywords: string[] = [];

    // Add mapped keywords for better FAQ matching
    Object.entries(deliveryKeywordMapping).forEach(([key, synonyms]) => {
        if (synonyms.some(synonym => message_lower.includes(synonym)) || message_lower.includes(key)) {
            additionalKeywords.push(key);
            additionalKeywords.push(...synonyms.filter(s => message_lower.includes(s)));
        }
    });

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

    // Add delivery-related mapped keywords
    keywords = [...new Set([...keywords, ...additionalKeywords])];

    return keywords;
};