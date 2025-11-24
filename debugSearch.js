const db = require('better-sqlite3')('data/ecommerce.db');

// Test the actual search query being used
const keywords = ['EMI', 'plans'];
const query = keywords.map(k => `question LIKE '%${k}%' OR answer LIKE '%${k}%' OR category LIKE '%${k}%'`).join(' OR ');
console.log('Search query:', query);

const searchQuery = `SELECT * FROM faqs WHERE ${query} LIMIT 3`;
console.log('Full query:', searchQuery);

const results = db.prepare(searchQuery).all();
console.log('Search results:', results);

db.close();