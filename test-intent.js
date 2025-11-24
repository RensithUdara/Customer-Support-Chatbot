// Simple test for intent detection
const testMessages = [
    'what payment methods are available?',
    'show all promotions',
    'customer support info',
    'shipping zones',
    'tell me about warranty',
    'all products',
    'show me payment options'
];

// Mock the intent detection logic (simplified version)
function testIntent(message) {
    const lowercaseMessage = message.toLowerCase();

    // Database query keywords
    const databaseQueryKeywords = [
        'how many', 'what are', 'list all', 'show me', 'tell me about', 'information about',
        'details about', 'all products', 'all orders', 'customer support', 'contact info',
        'support topics', 'warranty', 'promotions', 'shipping zones', 'payment methods',
        'available products', 'product categories', 'support contact', 'warranty policy',
        'current promotions', 'active promotions', 'payment options', 'shipping areas',
        'what payment', 'show payment', 'payment types', 'payment ways', 'ways to pay',
        'show warranty', 'warranty info', 'show promotions', 'current offers',
        'shipping options', 'delivery zones', 'support info', 'contact details'
    ];

    const hasDatabaseQueryKeywords = databaseQueryKeywords.some(keyword => lowercaseMessage.includes(keyword));

    // Policy keywords
    const policyKeywords = ['return', 'refund', 'policy', 'shipping', 'delivery charge', 'cash on delivery', 'cod', 'warranty', 'exchange', 'payment', 'pay', 'emi', 'card', 'credit', 'debit', 'wallet', 'upi', 'invoice', 'fee', 'charge', 'secure', 'account', 'login', 'password', 'profile'];
    const hasPolicyKeywords = policyKeywords.some(keyword => lowercaseMessage.includes(keyword));

    if (hasDatabaseQueryKeywords) {
        return { intent: 'DATABASE_QUERY', confidence: 0.8 };
    }

    if (hasPolicyKeywords) {
        return { intent: 'POLICY', confidence: 0.8 };
    }

    return { intent: 'OTHER', confidence: 0.3 };
}

console.log('=== TESTING INTENT DETECTION ===\n');
testMessages.forEach(message => {
    const result = testIntent(message);
    console.log(`Message: "${message}"`);
    console.log(`Result: ${result.intent} (confidence: ${result.confidence})`);
    console.log('---');
});