import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'data', 'ecommerce.db'));

const seedOrderData = () => {
    console.log('🔧 Seeding orders table with complete dummy data...');

    try {
        // First, clear existing orders
        db.exec('DELETE FROM orders');
        db.exec(`DELETE FROM sqlite_sequence WHERE name = 'orders'`);

        // Sample data
        const dummyOrders = [
            {
                orderId: '1001',
                customerId: 'CUST001',
                customerName: 'Rensith Perera',
                customerEmail: 'rensith@gmail.com',
                customerPhone: '0761155638',
                status: 'Delivered',
                orderDate: '2025-11-01T10:30:00Z',
                totalAmount: 28433,
                paymentMethod: 'Cash on Delivery',
                shippingAddress: '123 Main Street, Colombo 7, Sri Lanka',
                trackingNumber: 'TRK-20251101-123456',
                estimatedDelivery: '2025-11-05',
                items: JSON.stringify([
                    {
                        name: 'Oppo Y-series 128GB',
                        quantity: 1,
                        price: 28433,
                        category: 'Electronics'
                    }
                ])
            },
            {
                orderId: '1002',
                customerId: 'CUST002',
                customerName: 'Anuradha Silva',
                customerEmail: 'anuradha.silva@gmail.com',
                customerPhone: '0777234567',
                status: 'Processing',
                orderDate: '2025-11-15T14:20:00Z',
                totalAmount: 45680,
                paymentMethod: 'Credit Card',
                shippingAddress: '456 Temple Road, Kandy, Sri Lanka',
                trackingNumber: 'TRK-20251115-234567',
                estimatedDelivery: '2025-11-19',
                items: JSON.stringify([
                    {
                        name: 'Samsung Galaxy A52',
                        quantity: 1,
                        price: 45680,
                        category: 'Electronics'
                    }
                ])
            },
            {
                orderId: '1003',
                customerId: 'CUST003',
                customerName: 'Malith Kumarasiri',
                customerEmail: 'malith.k@email.com',
                customerPhone: '0718765432',
                status: 'Shipped',
                orderDate: '2025-11-08T08:15:00Z',
                totalAmount: 32500,
                paymentMethod: 'Debit Card',
                shippingAddress: '789 Beach Avenue, Galle, Sri Lanka',
                trackingNumber: 'TRK-20251108-345678',
                estimatedDelivery: '2025-11-12',
                items: JSON.stringify([
                    {
                        name: 'Xiaomi Redmi Note 10',
                        quantity: 1,
                        price: 32500,
                        category: 'Electronics'
                    }
                ])
            },
            {
                orderId: '1004',
                customerId: 'CUST004',
                customerName: 'Priya Jayasena',
                customerEmail: 'priya.j@hotmail.com',
                customerPhone: '0704567890',
                status: 'Out for Delivery',
                orderDate: '2025-11-18T11:45:00Z',
                totalAmount: 18900,
                paymentMethod: 'UPI',
                shippingAddress: '321 Park Lane, Negombo, Sri Lanka',
                trackingNumber: 'TRK-20251118-456789',
                estimatedDelivery: '2025-11-20',
                items: JSON.stringify([
                    {
                        name: 'Apple iPhone 12',
                        quantity: 1,
                        price: 18900,
                        category: 'Electronics'
                    }
                ])
            },
            {
                orderId: '1005',
                customerId: 'CUST005',
                customerName: 'Kasun Bandara',
                customerEmail: 'kasun.bandara@yahoo.com',
                customerPhone: '0763214567',
                status: 'Confirmed',
                orderDate: '2025-11-20T16:30:00Z',
                totalAmount: 55000,
                paymentMethod: 'Net Banking',
                shippingAddress: '654 Commercial Road, Colombo 4, Sri Lanka',
                trackingNumber: 'TRK-20251120-567890',
                estimatedDelivery: '2025-11-24',
                items: JSON.stringify([
                    {
                        name: 'OnePlus 9 Pro',
                        quantity: 1,
                        price: 55000,
                        category: 'Electronics'
                    }
                ])
            },
            {
                orderId: '1006',
                customerId: 'CUST006',
                customerName: 'Samantha Fernando',
                customerEmail: 'samantha.f@email.com',
                customerPhone: '0701234567',
                status: 'Delivered',
                orderDate: '2025-10-25T09:00:00Z',
                totalAmount: 23450,
                paymentMethod: 'Cash on Delivery',
                shippingAddress: '987 Valley Road, Matara, Sri Lanka',
                trackingNumber: 'TRK-20251025-678901',
                estimatedDelivery: '2025-10-29',
                items: JSON.stringify([
                    {
                        name: 'Realme 8 Pro',
                        quantity: 1,
                        price: 23450,
                        category: 'Electronics'
                    }
                ])
            },
            {
                orderId: '1007',
                customerId: 'CUST007',
                customerName: 'Dilshan Wijesundara',
                customerEmail: 'dilshan.w@gmail.com',
                customerPhone: '0725555555',
                status: 'Pending',
                orderDate: '2025-11-22T13:20:00Z',
                totalAmount: 34200,
                paymentMethod: 'Credit Card',
                shippingAddress: '234 Hill Street, Jaffna, Sri Lanka',
                trackingNumber: 'TRK-20251122-789012',
                estimatedDelivery: '2025-11-26',
                items: JSON.stringify([
                    {
                        name: 'Moto G100',
                        quantity: 2,
                        price: 17100,
                        category: 'Electronics'
                    }
                ])
            },
            {
                orderId: '1008',
                customerId: 'CUST008',
                customerName: 'Lakshmi Menon',
                customerEmail: 'lakshmi.menon@email.com',
                customerPhone: '0769999999',
                status: 'Processing',
                orderDate: '2025-11-19T10:10:00Z',
                totalAmount: 41600,
                paymentMethod: 'Debit Card',
                shippingAddress: '567 Green Road, Trincomalee, Sri Lanka',
                trackingNumber: 'TRK-20251119-890123',
                estimatedDelivery: '2025-11-23',
                items: JSON.stringify([
                    {
                        name: 'Google Pixel 6',
                        quantity: 1,
                        price: 41600,
                        category: 'Electronics'
                    }
                ])
            },
            {
                orderId: '1015',
                customerId: 'CUST009',
                customerName: 'Nihal Perera',
                customerEmail: 'nihal.p@gmail.com',
                customerPhone: '0712345678',
                status: 'Delivered',
                orderDate: '2025-11-10T09:30:00Z',
                totalAmount: 37999,
                paymentMethod: 'Credit Card',
                shippingAddress: '111 Merchant Street, Colombo 1, Sri Lanka',
                trackingNumber: 'TRK-20251110-901234',
                estimatedDelivery: '2025-11-14',
                items: JSON.stringify([
                    {
                        name: 'Vivo V21 5G',
                        quantity: 1,
                        price: 37999,
                        category: 'Electronics'
                    }
                ])
            },
            {
                orderId: '2001',
                customerId: 'CUST010',
                customerName: 'Hemali Dissanayake',
                customerEmail: 'hemali.d@email.com',
                customerPhone: '0756789012',
                status: 'Shipped',
                orderDate: '2025-11-17T15:45:00Z',
                totalAmount: 29999,
                paymentMethod: 'Cash on Delivery',
                shippingAddress: '222 Princess Street, Colombo 5, Sri Lanka',
                trackingNumber: 'TRK-20251117-012345',
                estimatedDelivery: '2025-11-21',
                items: JSON.stringify([
                    {
                        name: 'Samsung Galaxy M32',
                        quantity: 1,
                        price: 29999,
                        category: 'Electronics'
                    }
                ])
            },
            {
                orderId: '2101',
                customerId: 'CUST011',
                customerName: 'Roshan Kumar',
                customerEmail: 'roshan.kumar@yahoo.com',
                customerPhone: '0778901234',
                status: 'Out for Delivery',
                orderDate: '2025-11-21T12:15:00Z',
                totalAmount: 52500,
                paymentMethod: 'Debit Card',
                shippingAddress: '333 Colombo Street, Negombo, Sri Lanka',
                trackingNumber: 'TRK-20251121-123456',
                estimatedDelivery: '2025-11-23',
                items: JSON.stringify([
                    {
                        name: 'Poco X4 Pro',
                        quantity: 1,
                        price: 52500,
                        category: 'Electronics'
                    }
                ])
            },
            {
                orderId: '2102',
                customerId: 'CUST012',
                customerName: 'Anjali Nair',
                customerEmail: 'anjali.nair@gmail.com',
                customerPhone: '0711234567',
                status: 'Confirmed',
                orderDate: '2025-11-23T10:00:00Z',
                totalAmount: 44500,
                paymentMethod: 'UPI',
                shippingAddress: '444 Fort Street, Colombo 6, Sri Lanka',
                trackingNumber: 'TRK-20251123-234567',
                estimatedDelivery: '2025-11-27',
                items: JSON.stringify([
                    {
                        name: 'Motorola Edge 20',
                        quantity: 1,
                        price: 44500,
                        category: 'Electronics'
                    }
                ])
            },
            {
                orderId: '2103',
                customerId: 'CUST013',
                customerName: 'Chathura Jayawardene',
                customerEmail: 'chathura.j@email.com',
                customerPhone: '0745678901',
                status: 'Processing',
                orderDate: '2025-11-22T14:30:00Z',
                totalAmount: 33750,
                paymentMethod: 'Net Banking',
                shippingAddress: '555 Galle Road, Colombo 3, Sri Lanka',
                trackingNumber: 'TRK-20251122-345678',
                estimatedDelivery: '2025-11-26',
                items: JSON.stringify([
                    {
                        name: 'Infinix Hot 12',
                        quantity: 2,
                        price: 16875,
                        category: 'Electronics'
                    }
                ])
            }
        ];

        const insertStmt = db.prepare(`
            INSERT INTO orders (
                orderId,
                customerId,
                customerName,
                customerEmail,
                customerPhone,
                status,
                orderDate,
                totalAmount,
                paymentMethod,
                shippingAddress,
                trackingNumber,
                estimatedDelivery,
                items
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        let count = 0;
        dummyOrders.forEach(order => {
            insertStmt.run(
                order.orderId,
                order.customerId,
                order.customerName,
                order.customerEmail,
                order.customerPhone,
                order.status,
                order.orderDate,
                order.totalAmount,
                order.paymentMethod,
                order.shippingAddress,
                order.trackingNumber,
                order.estimatedDelivery,
                order.items
            );
            count++;
        });

        console.log(`✅ Successfully inserted ${count} orders with complete data!`);
        console.log('📊 Sample orders:');

        const result = db.prepare('SELECT COUNT(*) as total FROM orders').get() as any;
        console.log(`   Total orders in database: ${result.total}`);

        // Show sample
        const sample = db.prepare('SELECT orderId, customerName, status, totalAmount FROM orders LIMIT 3').all();
        console.log('   Sample data:');
        sample.forEach((order: any) => {
            console.log(`   - Order ${order.orderId}: ${order.customerName} | ${order.status} | LKR ${order.totalAmount}`);
        });

    } catch (error) {
        console.error('❌ Error seeding orders:', error);
        process.exit(1);
    }

    db.close();
};

// Run if executed directly
if (require.main === module) {
    seedOrderData();
}

export default seedOrderData;
