const fs = require('fs');

// Read the comprehensive data and check specific questions
const data = JSON.parse(fs.readFileSync('./data/comprehensiveData.json', 'utf8'));

console.log('🔍 Testing specific questions and their answers:\n');

// Test cases that users might ask
const testQuestions = [
    "Do you offer EMI plans?",
    "What are your delivery times?",
    "What is your return policy?",
    "I forgot my password. What should I do?",
    "Do your products include warranty?",
    "How can I track my order?"
];

testQuestions.forEach(question => {
    // Find exact match
    const exactMatch = data.faqs.find(faq => faq.question === question);

    if (exactMatch) {
        console.log(`✅ Question: "${question}"`);
        console.log(`   Category: ${exactMatch.category}`);
        console.log(`   Answer: "${exactMatch.answer}"`);
        console.log('');
    } else {
        console.log(`❌ Question not found: "${question}"`);

        // Find similar questions
        const similar = data.faqs.filter(faq =>
            faq.question.toLowerCase().includes(question.toLowerCase().split(' ')[0]) ||
            question.toLowerCase().includes(faq.question.toLowerCase().split(' ')[0])
        ).slice(0, 2);

        if (similar.length > 0) {
            console.log(`   Similar questions found:`);
            similar.forEach(s => console.log(`   - "${s.question}" → "${s.answer}"`));
        }
        console.log('');
    }
});

console.log('🎯 Database is ready with exact question-answer matching!');