import db, { initDatabase } from '../lib/db';
import { faqData, productsData, ordersData } from './seedData';

// Seed the database with initial data
const seedDatabase = () => {
    console.log('Seeding database...');

    // Ensure database is initialized first
    initDatabase();

    try {
        // Insert FAQs
        const insertFAQ = db.prepare('INSERT INTO faqs (category, question_example, answer_text) VALUES (?, ?, ?)');
        faqData.forEach(faq => {
            insertFAQ.run(faq.category, faq.question_example, faq.answer_text);
        });

        // Insert Products
        const insertProduct = db.prepare('INSERT INTO products (name, category, brand, price, description, tags) VALUES (?, ?, ?, ?, ?, ?)');
        productsData.forEach(product => {
            insertProduct.run(product.name, product.category, product.brand, product.price, product.description, product.tags);
        });

        // Insert Orders
        const insertOrder = db.prepare('INSERT INTO orders (id, customer_name, product_id, order_date, delivery_date, status) VALUES (?, ?, ?, ?, ?, ?)');
        ordersData.forEach(order => {
            insertOrder.run(order.id, order.customer_name, order.product_id, order.order_date, order.delivery_date, order.status);
        });

        console.log(`✅ Database seeded successfully!`);
        console.log(`   - ${faqData.length} FAQs inserted`);
        console.log(`   - ${productsData.length} products inserted`);
        console.log(`   - ${ordersData.length} orders inserted`);

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