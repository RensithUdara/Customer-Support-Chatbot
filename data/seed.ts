import db, { initDatabase } from '../lib/db';
import * as fs from 'fs';
import * as path from 'path';

// Load data from JSON file
const loadJsonData = () => {
    const jsonPath = path.join(process.cwd(), 'data.json');
    const rawData = fs.readFileSync(jsonPath, 'utf-8');
    return JSON.parse(rawData);
};

// Seed the database with initial data
const seedDatabase = () => {
    console.log('Seeding database...');

    // Ensure database is initialized first
    initDatabase();

    // Load data from JSON
    const data = loadJsonData();
    const { faqs, products, orders } = data;

    try {
        // Disable foreign key constraints during seeding
        db.exec('PRAGMA foreign_keys = OFF');

        // Clear existing data first
        try {
            db.exec('DELETE FROM conversations');
            db.exec('DELETE FROM orders');
            db.exec('DELETE FROM products');
            db.exec('DELETE FROM faqs');

            // Reset auto-increment counters
            db.exec('DELETE FROM sqlite_sequence WHERE name IN ("faqs", "products", "conversations")');
        } catch (error) {
            console.log('Clearing existing data (tables may be empty)...');
        }        // Insert FAQs
        const insertFAQ = db.prepare('INSERT INTO faqs (category, question_example, answer_text) VALUES (?, ?, ?)');
        faqs.forEach((faq: any) => {
            insertFAQ.run(faq.category, faq.question, faq.answer);
        });

        // Insert Products (with explicit IDs to match order references)
        const insertProduct = db.prepare('INSERT INTO products (id, name, category, brand, price, description, tags) VALUES (?, ?, ?, ?, ?, ?, ?)');
        products.forEach((product: any) => {
            // Set default values for missing fields
            const brand = product.brand || 'Generic';
            const description = product.description || `${product.name} - ${product.category}`;
            const tags = product.tags || product.category.toLowerCase();

            insertProduct.run(product.id, product.name, product.category, brand, product.price, description, tags);
        });        // Insert Orders
        const insertOrder = db.prepare('INSERT INTO orders (id, customer_name, product_id, order_date, delivery_date, status) VALUES (?, ?, ?, ?, ?, ?)');
        orders.forEach((order: any) => {
            insertOrder.run(order.order_id, order.customer, order.product_id, order.order_date, order.delivery_date, order.status);
        });

        // Re-enable foreign key constraints
        db.exec('PRAGMA foreign_keys = ON');

        console.log(`✅ Database seeded successfully!`);
        console.log(`   - ${faqs.length} FAQs inserted`);
        console.log(`   - ${products.length} products inserted`);
        console.log(`   - ${orders.length} orders inserted`);

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

// Run seeding if this file is executed directly
if (require.main === module) {
    seedDatabase();
}

export default seedDatabase;