const Database = require('better-sqlite3');
const path = require('path');

// Connect to the database
const db = new Database(path.join(__dirname, 'data', 'ecommerce.db'));

console.log('🔍 Analyzing Orders Table Structure and Data...\n');

try {
    // Get table structure
    console.log('📋 Orders Table Structure:');
    const tableInfo = db.prepare("PRAGMA table_info(orders)").all();
    tableInfo.forEach(col => {
        console.log(`   ${col.name}: ${col.type} ${col.notnull ? '(NOT NULL)' : '(NULLABLE)'} ${col.dflt_value ? `DEFAULT ${col.dflt_value}` : ''}`);
    });

    // Check for null values in each column
    console.log('\n🔍 Checking for NULL values in each column:');
    const sampleOrders = db.prepare('SELECT * FROM orders LIMIT 10').all();

    if (sampleOrders.length > 0) {
        const columns = Object.keys(sampleOrders[0]);

        columns.forEach(column => {
            const nullCount = db.prepare(`SELECT COUNT(*) as count FROM orders WHERE ${column} IS NULL`).get();
            if (nullCount.count > 0) {
                console.log(`   ❌ ${column}: ${nullCount.count} NULL values found`);
            } else {
                console.log(`   ✅ ${column}: No NULL values`);
            }
        });

        // Show sample records with potential issues
        console.log('\n📊 Sample Orders (first 5):');
        sampleOrders.slice(0, 5).forEach((order, index) => {
            console.log(`\n   Order ${index + 1}:`);
            Object.entries(order).forEach(([key, value]) => {
                const status = value === null ? '❌ NULL' : value === '' ? '⚠️  EMPTY' : '✅';
                console.log(`     ${key}: ${value} ${status}`);
            });
        });

        // Check specific problem areas
        console.log('\n🎯 Checking specific potential issues:');

        // Check for orders with null customer info
        const nullCustomers = db.prepare(`
            SELECT COUNT(*) as count FROM orders 
            WHERE customer_name IS NULL OR customer_email IS NULL OR customer_phone IS NULL
        `).get();
        console.log(`   Orders with missing customer info: ${nullCustomers.count}`);

        // Check for orders with null addresses
        const nullAddresses = db.prepare(`
            SELECT COUNT(*) as count FROM orders 
            WHERE shipping_address IS NULL OR billing_address IS NULL
        `).get();
        console.log(`   Orders with missing addresses: ${nullAddresses.count}`);

        // Check for orders with null payment info
        const nullPayments = db.prepare(`
            SELECT COUNT(*) as count FROM orders 
            WHERE payment_method IS NULL OR payment_status IS NULL
        `).get();
        console.log(`   Orders with missing payment info: ${nullPayments.count}`);

        // Check for orders with null dates
        const nullDates = db.prepare(`
            SELECT COUNT(*) as count FROM orders 
            WHERE order_date IS NULL OR updated_at IS NULL
        `).get();
        console.log(`   Orders with missing dates: ${nullDates.count}`);

    } else {
        console.log('❌ No orders found in the table');
    }

    console.log('\n📊 Total Orders Count:');
    const totalCount = db.prepare('SELECT COUNT(*) as count FROM orders').get();
    console.log(`   Total orders: ${totalCount.count}`);

} catch (error) {
    console.error('❌ Error analyzing orders table:', error);
} finally {
    db.close();
}