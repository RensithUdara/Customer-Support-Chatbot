const { getAllOrders } = require('./lib/db');

console.log('🔍 Checking available Order IDs in database...\n');

try {
    const orders = getAllOrders();
    console.log(`Found ${orders.length} orders in database`);
    console.log('\n📋 First 10 Order IDs:');
    orders.slice(0, 10).forEach((order, index) => {
        console.log(`${index + 1}. Order ID: ${order.order_id} - Status: ${order.order_status} - Customer: ${order.customer_name}`);
    });

    console.log('\n✅ Test these Order IDs in your chatbot:');
    orders.slice(0, 5).forEach((order, index) => {
        console.log(`• "What is the status of order ${order.order_id}?"`);
    });

} catch (error) {
    console.error('❌ Error accessing database:', error.message);
}

console.log('\n💡 Use these actual order IDs for testing!');