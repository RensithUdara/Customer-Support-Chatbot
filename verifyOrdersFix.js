const Database = require('better-sqlite3');
const path = require('path');

// Connect to the database
const db = new Database(path.join(__dirname, 'data', 'ecommerce.db'));

console.log('✅ Verifying Orders Table Fix...\n');

try {
    // Check for NULL values in each problematic column
    console.log('🔍 Checking NULL values in previously problematic columns:');

    const nullChecks = [
        { column: 'customerId', label: 'Customer IDs' },
        { column: 'customerEmail', label: 'Customer Emails' },
        { column: 'customerPhone', label: 'Customer Phones' },
        { column: 'shippingAddress', label: 'Shipping Addresses' },
        { column: 'trackingNumber', label: 'Tracking Numbers' },
        { column: 'items', label: 'Order Items' }
    ];

    let allFixed = true;
    nullChecks.forEach(check => {
        const nullCount = db.prepare(`SELECT COUNT(*) as count FROM orders WHERE ${check.column} IS NULL`).get();
        if (nullCount.count === 0) {
            console.log(`   ✅ ${check.label}: All records have values`);
        } else {
            console.log(`   ❌ ${check.label}: Still ${nullCount.count} NULL values`);
            allFixed = false;
        }
    });

    // Show sample updated records
    console.log('\n📊 Sample Updated Orders:');
    const samples = db.prepare(`
        SELECT orderId, customerName, customerEmail, customerPhone, 
               substr(shippingAddress, 1, 40) as address_preview,
               trackingNumber
        FROM orders 
        LIMIT 3
    `).all();

    samples.forEach((sample, index) => {
        console.log(`\n   Order ${index + 1} (${sample.orderId}):`);
        console.log(`     Customer: ${sample.customerName}`);
        console.log(`     Email: ${sample.customerEmail}`);
        console.log(`     Phone: ${sample.customerPhone}`);
        console.log(`     Address: ${sample.address_preview}...`);
        console.log(`     Tracking: ${sample.trackingNumber}`);
    });

    // Show sample items data
    console.log('\n🛍️ Sample Order Items:');
    const itemSample = db.prepare('SELECT orderId, items FROM orders LIMIT 1').get();
    console.log(`   Order ${itemSample.orderId} items:`);
    console.log(`   ${itemSample.items}`);

    // Final summary
    console.log('\n🎉 Orders Table Fix Summary:');
    const totalOrders = db.prepare('SELECT COUNT(*) as count FROM orders').get();
    console.log(`   📊 Total Orders: ${totalOrders.count}`);

    if (allFixed) {
        console.log('   ✅ ALL NULL values have been successfully fixed!');
        console.log('   ✅ Orders table is now complete with realistic data');
        console.log('   ✅ Customer support chatbot can now access full order information');
    } else {
        console.log('   ⚠️  Some NULL values may still exist');
    }

} catch (error) {
    console.error('❌ Error verifying orders table:', error);
} finally {
    db.close();
}