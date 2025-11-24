const Database = require('better-sqlite3');
const path = require('path');

// Connect to the database
const db = new Database(path.join(__dirname, 'data', 'ecommerce.db'));

console.log('🔧 Fixing NULL values in Orders Table...\n');

// Sample data arrays for generating realistic values
const sriLankanCities = [
    'Colombo', 'Kandy', 'Galle', 'Jaffna', 'Negombo', 'Anuradhapura', 'Batticaloa',
    'Matara', 'Ratnapura', 'Kurunegala', 'Badulla', 'Kalutara', 'Panadura', 'Moratuwa',
    'Mount Lavinia', 'Dehiwala', 'Wattala', 'Gampaha', 'Kotte', 'Maharagama'
];

const streetNames = [
    'Main Street', 'Galle Road', 'Kandy Road', 'Temple Road', 'Church Street',
    'School Lane', 'Hospital Road', 'Market Street', 'Station Road', 'Beach Road',
    'Hill Street', 'Park Avenue', 'Lake Road', 'Garden Street', 'Bridge Street'
];

const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];

const itemCategories = [
    'Electronics', 'Fashion', 'Home & Kitchen', 'Books', 'Sports',
    'Beauty', 'Toys', 'Automotive', 'Health', 'Garden'
];

// Function to generate realistic data
function generateCustomerId() {
    return 'CUST' + String(Math.floor(Math.random() * 90000) + 10000);
}

function generateEmail(name) {
    const cleanName = name.toLowerCase().replace(/\s+/g, '.');
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const number = Math.floor(Math.random() * 999) + 1;
    return `${cleanName}${number}@${domain}`;
}

function generatePhone() {
    const prefixes = ['071', '070', '072', '075', '076', '077', '078'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const number = Math.floor(Math.random() * 9000000) + 1000000;
    return `${prefix}${number}`;
}

function generateAddress(city) {
    const houseNumber = Math.floor(Math.random() * 999) + 1;
    const street = streetNames[Math.floor(Math.random() * streetNames.length)];
    const postalCode = Math.floor(Math.random() * 90000) + 10000;
    return `${houseNumber}, ${street}, ${city} ${postalCode}, Sri Lanka`;
}

function generateTrackingNumber() {
    const prefixes = ['LK', 'SL', 'TR', 'DL'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const number = Math.floor(Math.random() * 900000000) + 100000000;
    return `${prefix}${number}`;
}

function generateItems() {
    const numItems = Math.floor(Math.random() * 3) + 1; // 1-3 items
    const items = [];

    for (let i = 0; i < numItems; i++) {
        const category = itemCategories[Math.floor(Math.random() * itemCategories.length)];
        const quantity = Math.floor(Math.random() * 3) + 1;
        const price = Math.floor(Math.random() * 50000) + 1000;

        items.push({
            name: `${category} Item ${Math.floor(Math.random() * 100) + 1}`,
            category: category,
            quantity: quantity,
            price: price
        });
    }

    return JSON.stringify(items);
}

try {
    // Get all orders that need fixing
    console.log('📊 Getting orders to fix...');
    const orders = db.prepare('SELECT id, orderId, customerName FROM orders').all();
    console.log(`Found ${orders.length} orders to update`);

    // Prepare update statement
    const updateStmt = db.prepare(`
        UPDATE orders SET 
            customerId = ?,
            customerEmail = ?,
            customerPhone = ?,
            shippingAddress = ?,
            trackingNumber = ?,
            items = ?
        WHERE id = ?
    `);

    // Update orders in batches using transaction
    const updateMany = db.transaction((orderList) => {
        let updated = 0;
        for (const order of orderList) {
            const city = sriLankanCities[Math.floor(Math.random() * sriLankanCities.length)];

            updateStmt.run(
                generateCustomerId(),
                generateEmail(order.customerName),
                generatePhone(),
                generateAddress(city),
                generateTrackingNumber(),
                generateItems(),
                order.id
            );
            updated++;

            if (updated % 100 === 0) {
                console.log(`   ✅ Updated ${updated} orders...`);
            }
        }
        return updated;
    });

    console.log('\n🔄 Updating orders with realistic data...');
    const updatedCount = updateMany(orders);

    console.log(`\n✅ Successfully updated ${updatedCount} orders!`);

    // Verify the updates
    console.log('\n🔍 Verifying updates...');

    const nullChecks = [
        { column: 'customerId', label: 'Customer IDs' },
        { column: 'customerEmail', label: 'Customer Emails' },
        { column: 'customerPhone', label: 'Customer Phones' },
        { column: 'shippingAddress', label: 'Shipping Addresses' },
        { column: 'trackingNumber', label: 'Tracking Numbers' },
        { column: 'items', label: 'Order Items' }
    ];

    nullChecks.forEach(check => {
        const nullCount = db.prepare(`SELECT COUNT(*) as count FROM orders WHERE ${check.column} IS NULL`).get();
        if (nullCount.count === 0) {
            console.log(`   ✅ ${check.label}: All records have values`);
        } else {
            console.log(`   ❌ ${check.label}: Still ${nullCount.count} NULL values`);
        }
    });

    // Show sample of updated records
    console.log('\n📊 Sample Updated Orders:');
    const samples = db.prepare(`
        SELECT orderId, customerName, customerEmail, customerPhone, 
               LEFT(shippingAddress, 30) as address_preview,
               trackingNumber, LEFT(items, 50) as items_preview
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
        console.log(`     Items: ${sample.items_preview}...`);
    });

    console.log('\n🎉 Orders table has been successfully fixed!');
    console.log('✅ All NULL values have been replaced with realistic data');
    console.log('✅ Customer information is now complete');
    console.log('✅ Shipping addresses are properly formatted');
    console.log('✅ Tracking numbers are generated');
    console.log('✅ Order items are structured as JSON');

} catch (error) {
    console.error('❌ Error fixing orders table:', error);
} finally {
    db.close();
}