const Database = require('better-sqlite3');
const path = require('path');

// Connect to the database
const db = new Database(path.join(__dirname, 'data', 'ecommerce.db'));

console.log('🚀 Creating and populating additional database tables...\n');

// First, create all the new tables
console.log('📋 Creating database tables...');

// Create delivery policies table
db.exec(`
  CREATE TABLE IF NOT EXISTS delivery_policies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    policy_name TEXT NOT NULL,
    description TEXT NOT NULL,
    delivery_time TEXT,
    cost REAL,
    areas_covered TEXT,
    restrictions TEXT,
    is_active BOOLEAN DEFAULT 1
  )
`);
console.log('✅ Created delivery_policies table');

// Create return policies table
db.exec(`
  CREATE TABLE IF NOT EXISTS return_policies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    policy_name TEXT NOT NULL,
    description TEXT NOT NULL,
    return_window_days INTEGER,
    conditions TEXT,
    refund_method TEXT,
    processing_time TEXT,
    category TEXT,
    is_active BOOLEAN DEFAULT 1
  )
`);
console.log('✅ Created return_policies table');

// Create payment methods table
db.exec(`
  CREATE TABLE IF NOT EXISTS payment_methods (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    method_name TEXT NOT NULL,
    description TEXT NOT NULL,
    processing_fee REAL DEFAULT 0,
    min_amount REAL DEFAULT 0,
    max_amount REAL,
    supported_regions TEXT,
    is_active BOOLEAN DEFAULT 1
  )
`);
console.log('✅ Created payment_methods table');

// Create warranty policies table
db.exec(`
  CREATE TABLE IF NOT EXISTS warranty_policies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_category TEXT NOT NULL,
    warranty_period TEXT NOT NULL,
    description TEXT NOT NULL,
    coverage TEXT,
    exclusions TEXT,
    claim_process TEXT,
    contact_info TEXT
  )
`);
console.log('✅ Created warranty_policies table');

// Create customer support table
db.exec(`
  CREATE TABLE IF NOT EXISTS customer_support (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    support_type TEXT NOT NULL,
    contact_method TEXT NOT NULL,
    contact_info TEXT NOT NULL,
    availability TEXT,
    response_time TEXT,
    languages_supported TEXT,
    department TEXT
  )
`);
console.log('✅ Created customer_support table');

// Create shipping zones table
db.exec(`
  CREATE TABLE IF NOT EXISTS shipping_zones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    zone_name TEXT NOT NULL,
    regions TEXT NOT NULL,
    standard_delivery_days INTEGER,
    express_delivery_days INTEGER,
    standard_cost REAL,
    express_cost REAL,
    cod_available BOOLEAN DEFAULT 0
  )
`);
console.log('✅ Created shipping_zones table');

// Create promotions table
db.exec(`
  CREATE TABLE IF NOT EXISTS promotions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    promo_name TEXT NOT NULL,
    description TEXT NOT NULL,
    discount_type TEXT,
    discount_value REAL,
    min_order_amount REAL,
    valid_from TEXT,
    valid_until TEXT,
    promo_code TEXT,
    terms_conditions TEXT,
    is_active BOOLEAN DEFAULT 1
  )
`);
console.log('✅ Created promotions table');

console.log('\n📊 Now populating tables with data...\n');

// Data arrays (same as before)
const deliveryPolicies = [
    {
        policy_name: 'Standard Delivery',
        description: 'Regular delivery service for most areas in Sri Lanka',
        delivery_time: '3-5 business days',
        cost: 250.00,
        areas_covered: 'All major cities and towns in Sri Lanka',
        restrictions: 'Excludes remote areas and conflict zones',
        is_active: 1
    },
    {
        policy_name: 'Express Delivery',
        description: 'Fast delivery service for urgent orders',
        delivery_time: '1-2 business days',
        cost: 500.00,
        areas_covered: 'Colombo, Kandy, Galle, Jaffna, Matara, Negombo',
        restrictions: 'Available only for selected cities and items under 10kg',
        is_active: 1
    },
    {
        policy_name: 'Same Day Delivery',
        description: 'Ultra-fast delivery within the same day',
        delivery_time: 'Same day (if ordered before 2 PM)',
        cost: 800.00,
        areas_covered: 'Colombo metro area only',
        restrictions: 'Orders must be placed before 2 PM, limited items only',
        is_active: 1
    },
    {
        policy_name: 'Free Delivery',
        description: 'Complimentary delivery for orders above threshold',
        delivery_time: '3-5 business days',
        cost: 0.00,
        areas_covered: 'All areas covered by standard delivery',
        restrictions: 'Minimum order value Rs. 10,000 required',
        is_active: 1
    },
    {
        policy_name: 'International Delivery',
        description: 'Delivery service to other countries',
        delivery_time: '7-14 business days',
        cost: 2500.00,
        areas_covered: 'Selected international destinations',
        restrictions: 'Currently not available, local delivery only',
        is_active: 0
    }
];

const returnPolicies = [
    {
        policy_name: 'Standard Return Policy',
        description: 'General return policy for most products',
        return_window_days: 14,
        conditions: 'Items must be unused, in original packaging with all accessories',
        refund_method: 'Original payment method',
        processing_time: '3-7 business days after item inspection',
        category: 'General',
        is_active: 1
    },
    {
        policy_name: 'Electronics Return Policy',
        description: 'Specialized return policy for electronic items',
        return_window_days: 7,
        conditions: 'Must include original box, warranty card, and all accessories',
        refund_method: 'Original payment method or store credit',
        processing_time: '5-10 business days after technical inspection',
        category: 'Electronics',
        is_active: 1
    },
    {
        policy_name: 'Fashion Return Policy',
        description: 'Return policy for clothing and fashion items',
        return_window_days: 14,
        conditions: 'Items must be unworn, with original tags attached',
        refund_method: 'Exchange or store credit preferred',
        processing_time: '2-5 business days after inspection',
        category: 'Fashion',
        is_active: 1
    },
    {
        policy_name: 'Non-Returnable Policy',
        description: 'Items that cannot be returned',
        return_window_days: 0,
        conditions: 'Cosmetics, undergarments, personalized items, clearance products',
        refund_method: 'No refund available',
        processing_time: 'Not applicable',
        category: 'Non-Returnable',
        is_active: 1
    },
    {
        policy_name: 'Defective Item Policy',
        description: 'Policy for damaged or defective products',
        return_window_days: 30,
        conditions: 'Report within 48 hours of delivery with photos',
        refund_method: 'Free replacement or full refund',
        processing_time: 'Immediate replacement, 1-3 days processing',
        category: 'Defective',
        is_active: 1
    }
];

const paymentMethods = [
    {
        method_name: 'Credit/Debit Cards',
        description: 'Visa, MasterCard, American Express accepted',
        processing_fee: 0.00,
        min_amount: 100.00,
        max_amount: 500000.00,
        supported_regions: 'Sri Lanka and international cards',
        is_active: 1
    },
    {
        method_name: 'Cash on Delivery (COD)',
        description: 'Pay cash when your order is delivered',
        processing_fee: 50.00,
        min_amount: 500.00,
        max_amount: 50000.00,
        supported_regions: 'Selected districts only',
        is_active: 1
    },
    {
        method_name: 'Bank Transfer',
        description: 'Direct bank transfer to our account',
        processing_fee: 0.00,
        min_amount: 1000.00,
        max_amount: 1000000.00,
        supported_regions: 'All Sri Lankan banks',
        is_active: 1
    },
    {
        method_name: 'Mobile Wallets',
        description: 'eZ Cash, mCash, and other digital wallets',
        processing_fee: 0.00,
        min_amount: 100.00,
        max_amount: 100000.00,
        supported_regions: 'Sri Lanka mobile networks',
        is_active: 1
    },
    {
        method_name: 'EMI Plans',
        description: 'Easy monthly installments for large purchases',
        processing_fee: 2.5,
        min_amount: 25000.00,
        max_amount: 500000.00,
        supported_regions: 'Available with partner banks',
        is_active: 1
    },
    {
        method_name: 'Buy Now Pay Later',
        description: 'Koko, mintpay and other BNPL services',
        processing_fee: 0.00,
        min_amount: 5000.00,
        max_amount: 200000.00,
        supported_regions: 'Sri Lanka registered users',
        is_active: 1
    }
];

const warrantyPolicies = [
    {
        product_category: 'Electronics',
        warranty_period: '1 year manufacturer warranty',
        description: 'Comprehensive warranty covering manufacturing defects',
        coverage: 'Hardware failures, manufacturing defects, software issues',
        exclusions: 'Physical damage, water damage, misuse, normal wear and tear',
        claim_process: 'Contact support with purchase receipt and serial number',
        contact_info: 'warranty@yourstore.lk or call +94 11 234 5678'
    },
    {
        product_category: 'Home Appliances',
        warranty_period: '2 year manufacturer warranty',
        description: 'Extended warranty for home appliances',
        coverage: 'Motor, compressor, electrical components, parts replacement',
        exclusions: 'Consumable parts, filters, normal wear items, mishandling',
        claim_process: 'Schedule home service visit through customer support',
        contact_info: 'appliances@yourstore.lk or WhatsApp +94 77 123 4567'
    },
    {
        product_category: 'Mobile Phones',
        warranty_period: '1 year international warranty',
        description: 'Global warranty coverage for mobile devices',
        coverage: 'Hardware defects, battery issues, display problems, software',
        exclusions: 'Screen cracks, water damage, rooting/jailbreaking, drops',
        claim_process: 'Visit authorized service center with purchase proof',
        contact_info: 'mobile@yourstore.lk or service hotline 1955'
    },
    {
        product_category: 'Laptops & Computers',
        warranty_period: '2 year comprehensive warranty',
        description: 'Extended warranty for computing devices',
        coverage: 'Hardware components, software support, data recovery assistance',
        exclusions: 'Software corruption due to viruses, physical damage, liquid damage',
        claim_process: 'Remote diagnosis available, on-site service for desktops',
        contact_info: 'computers@yourstore.lk or tech support +94 11 567 8900'
    },
    {
        product_category: 'Fashion & Accessories',
        warranty_period: '6 months quality guarantee',
        description: 'Quality assurance for fashion items',
        coverage: 'Manufacturing defects, color fading, stitching issues',
        exclusions: 'Normal wear and tear, washing damage, alterations',
        claim_process: 'Return to store with receipt for exchange or store credit',
        contact_info: 'fashion@yourstore.lk or visit nearest store'
    }
];

const customerSupport = [
    {
        support_type: 'Phone Support',
        contact_method: 'Phone Call',
        contact_info: '+94 11 234 5678',
        availability: '9:00 AM - 9:00 PM (Monday to Sunday)',
        response_time: 'Immediate during business hours',
        languages_supported: 'Sinhala, Tamil, English',
        department: 'General Support'
    },
    {
        support_type: 'Email Support',
        contact_method: 'Email',
        contact_info: 'help@yourstore.lk',
        availability: '24/7 (responses within business hours)',
        response_time: '2-4 hours during business days',
        languages_supported: 'Sinhala, Tamil, English',
        department: 'General Support'
    },
    {
        support_type: 'Live Chat',
        contact_method: 'Website Chat',
        contact_info: 'Available on website and mobile app',
        availability: '9:00 AM - 9:00 PM (Monday to Sunday)',
        response_time: 'Immediate during business hours',
        languages_supported: 'English primarily',
        department: 'Sales & Support'
    },
    {
        support_type: 'WhatsApp Support',
        contact_method: 'WhatsApp',
        contact_info: '+94 77 123 4567',
        availability: '9:00 AM - 6:00 PM (Monday to Saturday)',
        response_time: '15-30 minutes during business hours',
        languages_supported: 'Sinhala, Tamil, English',
        department: 'Order Support'
    },
    {
        support_type: 'Technical Support',
        contact_method: 'Phone/Email',
        contact_info: 'tech@yourstore.lk or +94 11 567 8900',
        availability: '9:00 AM - 7:00 PM (Monday to Friday)',
        response_time: '1-2 hours for technical issues',
        languages_supported: 'English, Sinhala',
        department: 'Technical Team'
    },
    {
        support_type: 'Returns & Refunds',
        contact_method: 'Email/Phone',
        contact_info: 'returns@yourstore.lk or +94 11 345 6789',
        availability: '9:00 AM - 6:00 PM (Monday to Friday)',
        response_time: '4-6 hours for return requests',
        languages_supported: 'Sinhala, Tamil, English',
        department: 'Returns Department'
    }
];

const shippingZones = [
    {
        zone_name: 'Colombo Metro',
        regions: 'Colombo, Mount Lavinia, Dehiwala, Moratuwa, Sri Jayawardenepura',
        standard_delivery_days: 2,
        express_delivery_days: 1,
        standard_cost: 200.00,
        express_cost: 400.00,
        cod_available: 1
    },
    {
        zone_name: 'Western Province',
        regions: 'Gampaha, Kalutara, Negombo, Panadura, Wattala',
        standard_delivery_days: 3,
        express_delivery_days: 2,
        standard_cost: 250.00,
        express_cost: 500.00,
        cod_available: 1
    },
    {
        zone_name: 'Central Province',
        regions: 'Kandy, Matale, Nuwara Eliya, Hatton, Dambulla',
        standard_delivery_days: 4,
        express_delivery_days: 2,
        standard_cost: 300.00,
        express_cost: 600.00,
        cod_available: 1
    },
    {
        zone_name: 'Southern Province',
        regions: 'Galle, Matara, Hambantota, Tangalle, Weligama',
        standard_delivery_days: 4,
        express_delivery_days: 3,
        standard_cost: 350.00,
        express_cost: 650.00,
        cod_available: 1
    },
    {
        zone_name: 'Northern Province',
        regions: 'Jaffna, Vavuniya, Mannar, Kilinochchi, Mullaitivu',
        standard_delivery_days: 5,
        express_delivery_days: 3,
        standard_cost: 400.00,
        express_cost: 750.00,
        cod_available: 0
    },
    {
        zone_name: 'Eastern Province',
        regions: 'Batticaloa, Trincomalee, Ampara, Kalmunai, Akkaraipattu',
        standard_delivery_days: 5,
        express_delivery_days: 3,
        standard_cost: 450.00,
        express_cost: 800.00,
        cod_available: 0
    }
];

const promotions = [
    {
        promo_name: 'Welcome Discount',
        description: 'Special discount for first-time customers',
        discount_type: 'Percentage',
        discount_value: 15.0,
        min_order_amount: 5000.00,
        valid_from: '2024-01-01',
        valid_until: '2025-12-31',
        promo_code: 'WELCOME15',
        terms_conditions: 'Valid for first purchase only. Cannot be combined with other offers.',
        is_active: 1
    },
    {
        promo_name: 'Free Shipping',
        description: 'Free delivery on orders above Rs. 10,000',
        discount_type: 'Free Shipping',
        discount_value: 0.0,
        min_order_amount: 10000.00,
        valid_from: '2024-01-01',
        valid_until: '2025-12-31',
        promo_code: 'FREESHIP',
        terms_conditions: 'Applicable to standard delivery only. Express charges may apply.',
        is_active: 1
    },
    {
        promo_name: 'Student Discount',
        description: 'Special pricing for students with valid ID',
        discount_type: 'Percentage',
        discount_value: 10.0,
        min_order_amount: 2000.00,
        valid_from: '2024-01-01',
        valid_until: '2025-12-31',
        promo_code: 'STUDENT10',
        terms_conditions: 'Valid student ID required. Verification may be requested.',
        is_active: 1
    },
    {
        promo_name: 'Loyalty Rewards',
        description: 'Points-based rewards for repeat customers',
        discount_type: 'Points',
        discount_value: 5.0,
        min_order_amount: 1000.00,
        valid_from: '2024-01-01',
        valid_until: '2025-12-31',
        promo_code: 'LOYALTY',
        terms_conditions: 'Earn 1 point per Rs. 100 spent. 100 points = Rs. 500 discount.',
        is_active: 1
    },
    {
        promo_name: 'Flash Sale',
        description: 'Limited time mega discounts',
        discount_type: 'Percentage',
        discount_value: 25.0,
        min_order_amount: 15000.00,
        valid_from: '2024-11-24',
        valid_until: '2024-11-30',
        promo_code: 'FLASH25',
        terms_conditions: 'Limited stock. First come, first served. No returns on sale items.',
        is_active: 1
    }
];

// Function to insert data into tables
function populateTable(tableName, data, columns) {
    console.log(`📊 Populating ${tableName} table...`);

    // Clear existing data first
    try {
        db.prepare(`DELETE FROM ${tableName}`).run();
    } catch (e) {
        console.log(`   Note: ${tableName} table was empty or didn't exist`);
    }

    // Create placeholders for the prepared statement
    const placeholders = columns.map(() => '?').join(', ');
    const insertStmt = db.prepare(`INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`);

    const insertMany = db.transaction((items) => {
        for (const item of items) {
            const values = columns.map(col => item[col]);
            insertStmt.run(...values);
        }
    });

    insertMany(data);
    console.log(`✅ Inserted ${data.length} records into ${tableName}`);
}

// Populate all tables
try {
    populateTable('delivery_policies', deliveryPolicies,
        ['policy_name', 'description', 'delivery_time', 'cost', 'areas_covered', 'restrictions', 'is_active']);

    populateTable('return_policies', returnPolicies,
        ['policy_name', 'description', 'return_window_days', 'conditions', 'refund_method', 'processing_time', 'category', 'is_active']);

    populateTable('payment_methods', paymentMethods,
        ['method_name', 'description', 'processing_fee', 'min_amount', 'max_amount', 'supported_regions', 'is_active']);

    populateTable('warranty_policies', warrantyPolicies,
        ['product_category', 'warranty_period', 'description', 'coverage', 'exclusions', 'claim_process', 'contact_info']);

    populateTable('customer_support', customerSupport,
        ['support_type', 'contact_method', 'contact_info', 'availability', 'response_time', 'languages_supported', 'department']);

    populateTable('shipping_zones', shippingZones,
        ['zone_name', 'regions', 'standard_delivery_days', 'express_delivery_days', 'standard_cost', 'express_cost', 'cod_available']);

    populateTable('promotions', promotions,
        ['promo_name', 'description', 'discount_type', 'discount_value', 'min_order_amount', 'valid_from', 'valid_until', 'promo_code', 'terms_conditions', 'is_active']);

    console.log('\n🎉 All additional tables have been created and populated successfully!');

    // Show database summary
    console.log('\n📊 Complete Database Summary:');

    // Check existing tables
    const existingTables = ['faqs', 'products', 'orders', 'conversations'];
    for (const table of existingTables) {
        try {
            const count = db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get();
            console.log(`✅ ${table}: ${count.count} records`);
        } catch (e) {
            console.log(`⚠️  ${table}: Table may not exist or be empty`);
        }
    }

    // New tables
    console.log(`✅ delivery_policies: ${deliveryPolicies.length} records`);
    console.log(`✅ return_policies: ${returnPolicies.length} records`);
    console.log(`✅ payment_methods: ${paymentMethods.length} records`);
    console.log(`✅ warranty_policies: ${warrantyPolicies.length} records`);
    console.log(`✅ customer_support: ${customerSupport.length} records`);
    console.log(`✅ shipping_zones: ${shippingZones.length} records`);
    console.log(`✅ promotions: ${promotions.length} records`);

    console.log('\n🚀 Your ecommerce database now has comprehensive data for all business operations!');
    console.log('🎯 Additional tables include: delivery policies, return policies, payment methods,');
    console.log('   warranty policies, customer support info, shipping zones, and promotions.');

} catch (error) {
    console.error('❌ Error populating database:', error);
} finally {
    db.close();
}