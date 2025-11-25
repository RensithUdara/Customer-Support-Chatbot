const Database = require('better-sqlite3');
const db = new Database('./sqlite.db');

console.log('Checking database tables...');
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('Tables:', tables.map(t => t.name));

// Check if product_recommendations exists and sample data
if (tables.find(t => t.name === 'product_recommendations')) {
    console.log('\nChecking product_recommendations table...');
    const products = db.prepare('SELECT * FROM product_recommendations WHERE name LIKE ? LIMIT 5').all('%acer%');
    console.log('Acer products:', products);
    
    if (products.length === 0) {
        console.log('\nNo Acer products found. Checking all products...');
        const allProducts = db.prepare('SELECT * FROM product_recommendations LIMIT 10').all();
        console.log('Sample products:', allProducts);
    }
}

db.close();