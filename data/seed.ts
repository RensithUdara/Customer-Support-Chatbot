import db, { initDatabase } from '../lib/db';
import * as fs from 'fs';
import * as path from 'path';

// Load data from comprehensive JSON file
const loadJsonData = () => {
    const jsonPath = path.join(process.cwd(), 'data', 'comprehensiveData.json');
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
        const insertFAQ = db.prepare('INSERT INTO faqs (category, question, answer, tags) VALUES (?, ?, ?, ?)');
        faqs.forEach((faq: any) => {
            const tags = faq.category.toLowerCase().replace(/ & /g, ',').replace(/ /g, ',');
            insertFAQ.run(faq.category, faq.question, faq.answer, tags);
        });

        // Insert Products (with explicit IDs to match order references)
        const insertProduct = db.prepare('INSERT INTO products (id, name, category, brand, price, description, stock, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
        products.forEach((product: any) => {
            // Set default values for missing fields
            const brand = product.name.split(' ')[0] || 'Generic';
            const description = `High-quality ${product.category.toLowerCase()} product with latest features and excellent performance`;
            const stock = Math.floor(Math.random() * 100) + 10; // Random stock between 10-110
            const rating = (Math.random() * 2 + 3).toFixed(1); // Random rating between 3.0-5.0

            insertProduct.run(product.id, product.name, product.category, brand, product.price, description, stock, parseFloat(rating));
        });        // Insert Orders
        const insertOrder = db.prepare('INSERT INTO orders (orderId, customerName, status, orderDate, estimatedDelivery, totalAmount, paymentMethod) VALUES (?, ?, ?, ?, ?, ?, ?)');
        orders.forEach((order: any) => {
            const totalAmount = Math.floor(Math.random() * 50000) + 1000; // Random amount between 1000-51000
            const paymentMethods = ['Credit Card', 'Debit Card', 'UPI', 'Cash on Delivery', 'Net Banking'];
            const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

            insertOrder.run(
                order.order_id.toString(),
                order.customer,
                order.status,
                order.order_date,
                order.delivery_date,
                totalAmount,
                paymentMethod
            );
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