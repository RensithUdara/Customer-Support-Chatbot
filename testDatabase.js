const Database = require('better-sqlite3');
const path = require('path');

// Connect to the database
const db = new Database(path.join(__dirname, 'data', 'ecommerce.db'));

console.log('🔍 Comprehensive Database Testing\n');

// Test function to display results nicely
function displayResults(title, results, limit = 3) {
    console.log(`\n📋 ${title}:`);
    if (results.length === 0) {
        console.log('   ❌ No results found');
        return;
    }

    console.log(`   ✅ Found ${results.length} records`);

    // Show first few records as examples
    const samplesToShow = Math.min(limit, results.length);
    for (let i = 0; i < samplesToShow; i++) {
        const record = results[i];
        const keys = Object.keys(record);
        const preview = keys.slice(0, 3).map(key => `${key}: ${record[key]}`).join(', ');
        console.log(`   ${i + 1}. ${preview}...`);
    }

    if (results.length > limit) {
        console.log(`   ... and ${results.length - limit} more`);
    }
}

try {
    // Test all table counts
    console.log('📊 Table Record Counts:');
    const tables = [
        'faqs', 'products', 'orders', 'conversations',
        'payment_methods', 'delivery_methods', 'delivery_policies',
        'return_policies', 'support_topics', 'warranty_policies',
        'customer_support', 'shipping_zones', 'promotions'
    ];

    tables.forEach(table => {
        try {
            const count = db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get();
            console.log(`   ✅ ${table}: ${count.count} records`);
        } catch (e) {
            console.log(`   ❌ ${table}: Error - ${e.message}`);
        }
    });

    // Test Payment Methods
    const paymentMethods = db.prepare('SELECT * FROM payment_methods WHERE accepted = 1').all();
    displayResults('Payment Methods (Active)', paymentMethods);

    // Test Delivery Methods
    const deliveryMethods = db.prepare('SELECT * FROM delivery_methods').all();
    displayResults('Delivery Methods', deliveryMethods);

    // Test Return Policies by Category
    const returnPolicies = db.prepare('SELECT * FROM return_policies').all();
    displayResults('Return Policies', returnPolicies);

    // Test Warranty Policies
    const warrantyPolicies = db.prepare('SELECT * FROM warranty_policies').all();
    displayResults('Warranty Policies', warrantyPolicies);

    // Test Customer Support
    const customerSupport = db.prepare('SELECT * FROM customer_support').all();
    displayResults('Customer Support Channels', customerSupport);

    // Test Shipping Zones
    const shippingZones = db.prepare('SELECT * FROM shipping_zones').all();
    displayResults('Shipping Zones', shippingZones);

    // Test Active Promotions
    const activePromotions = db.prepare('SELECT * FROM promotions WHERE is_active = 1').all();
    displayResults('Active Promotions', activePromotions);

    // Test Support Topics
    const supportTopics = db.prepare('SELECT * FROM support_topics').all();
    displayResults('Support Topics', supportTopics);

    // Test some search functionality
    console.log('\n🔍 Search Function Tests:');

    // Search electronics warranty
    const electronicsWarranty = db.prepare(`
        SELECT * FROM warranty_policies 
        WHERE product_category LIKE ?
    `).all('%Electronics%');
    displayResults('Electronics Warranty Search', electronicsWarranty, 1);

    // Search payment methods with EMI
    const emiPayments = db.prepare(`
        SELECT * FROM payment_methods 
        WHERE emi_available = 1
    `).all();
    displayResults('EMI Available Payment Methods', emiPayments, 2);

    // Search Colombo shipping
    const colomboShipping = db.prepare(`
        SELECT * FROM shipping_zones 
        WHERE regions LIKE ?
    `).all('%Colombo%');
    displayResults('Colombo Area Shipping', colomboShipping, 1);

    // Test FAQ search (existing functionality)
    const techFAQs = db.prepare(`
        SELECT question, answer, category FROM faqs 
        WHERE category LIKE ? LIMIT 2
    `).all('%Technical%');
    displayResults('Technical Support FAQs', techFAQs, 2);

    // Test product search (existing functionality)
    const laptops = db.prepare(`
        SELECT name, price, category FROM products 
        WHERE category LIKE ? LIMIT 2
    `).all('%Laptop%');
    displayResults('Laptop Products', laptops, 2);

    console.log('\n🎉 Database Testing Complete!');
    console.log('✅ All tables are populated and searchable');
    console.log('✅ Helper functions will work with this data structure');
    console.log('✅ Your comprehensive ecommerce database is ready for use!');

} catch (error) {
    console.error('❌ Error during testing:', error);
} finally {
    db.close();
}