const Database = require('better-sqlite3');
const db = new Database('./ecommerce.db');

console.log('Checking database tables...');
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('Tables:', tables.map(t => t.name));

// Check products table
if (tables.find(t => t.name === 'products')) {
    console.log('\nChecking products table...');
    
    // Check Acer products
    const acerProducts = db.prepare('SELECT * FROM products WHERE name LIKE ? OR brand LIKE ? LIMIT 5').all('%acer%', '%acer%');
    console.log('Acer products:', acerProducts);
    
    // Check Inspiron products (Dell series)
    const inspironProducts = db.prepare('SELECT * FROM products WHERE name LIKE ? LIMIT 5').all('%inspiron%');
    console.log('Inspiron products:', inspironProducts);
    
    // Check Ryzen products (AMD)
    const ryzenProducts = db.prepare('SELECT * FROM products WHERE name LIKE ? OR features LIKE ? LIMIT 5').all('%ryzen%', '%ryzen%');
    console.log('Ryzen products:', ryzenProducts);
    
    if (acerProducts.length === 0 && inspironProducts.length === 0 && ryzenProducts.length === 0) {
        console.log('\nNo matching products found. Checking all products...');
        const allProducts = db.prepare('SELECT * FROM products LIMIT 10').all();
        console.log('Sample products:', allProducts);
    }
}

db.close();