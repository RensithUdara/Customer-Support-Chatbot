const db = require('better-sqlite3')('data/ecommerce.db');

// Check FAQ data for EMI question
const emiQuery = db.prepare("SELECT * FROM faqs WHERE question LIKE '%EMI%' OR question LIKE '%emi%'").all();
console.log('EMI FAQs in database:', emiQuery);

// Check payment-related FAQs
const paymentQuery = db.prepare("SELECT * FROM faqs WHERE category LIKE '%Payment%' LIMIT 10").all();
console.log('\nPayment FAQs in database:', paymentQuery);

db.close();