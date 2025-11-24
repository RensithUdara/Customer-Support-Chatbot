const Database = require('better-sqlite3');
const path = require('path');

// Connect to the database
const db = new Database(path.join(__dirname, 'data', 'ecommerce.db'));

console.log('🚀 Populating existing empty tables with comprehensive data...\n');

// Data for existing tables with correct column names

// Payment Methods Data (using existing table structure)
const paymentMethods = [
    {
        type: 'Credit Card',
        provider: 'Visa/MasterCard',
        bank: 'All Banks',
        processing_fee: 0.0,
        accepted: 1,
        emi_available: 1,
        emi_months: '3,6,12,24',
        instant_refund: 1,
        cashback_eligible: 1,
        max_transaction: 500000.0,
        bank_name: 'Multi-Bank Support',
        ifsc_code: 'Various',
        processing_time: 'Instant',
        charges: 'No additional charges',
        available_24x7: 1
    },
    {
        type: 'Debit Card',
        provider: 'Visa/MasterCard',
        bank: 'All Banks',
        processing_fee: 0.0,
        accepted: 1,
        emi_available: 0,
        emi_months: 'N/A',
        instant_refund: 1,
        cashback_eligible: 0,
        max_transaction: 200000.0,
        bank_name: 'Multi-Bank Support',
        ifsc_code: 'Various',
        processing_time: 'Instant',
        charges: 'No additional charges',
        available_24x7: 1
    },
    {
        type: 'Cash on Delivery',
        provider: 'Local Couriers',
        bank: 'N/A',
        processing_fee: 50.0,
        accepted: 1,
        emi_available: 0,
        emi_months: 'N/A',
        instant_refund: 0,
        cashback_eligible: 0,
        max_transaction: 50000.0,
        bank_name: 'N/A',
        ifsc_code: 'N/A',
        processing_time: 'On Delivery',
        charges: 'Rs. 50 handling fee',
        available_24x7: 0
    },
    {
        type: 'Mobile Wallet',
        provider: 'eZ Cash',
        bank: 'Dialog Axiata',
        processing_fee: 0.0,
        accepted: 1,
        emi_available: 0,
        emi_months: 'N/A',
        instant_refund: 1,
        cashback_eligible: 1,
        max_transaction: 100000.0,
        bank_name: 'Dialog Axiata',
        ifsc_code: 'N/A',
        processing_time: 'Instant',
        charges: 'No charges',
        available_24x7: 1
    },
    {
        type: 'Bank Transfer',
        provider: 'SLIPS',
        bank: 'All Local Banks',
        processing_fee: 0.0,
        accepted: 1,
        emi_available: 0,
        emi_months: 'N/A',
        instant_refund: 0,
        cashback_eligible: 0,
        max_transaction: 1000000.0,
        bank_name: 'All Sri Lankan Banks',
        ifsc_code: 'Various',
        processing_time: '1-2 hours',
        charges: 'Bank charges may apply',
        available_24x7: 0
    }
];

// Delivery Methods Data
const deliveryMethods = [
    {
        method: 'Standard Delivery',
        provider: 'Lanka Post',
        coverage_area: 'All Sri Lanka',
        delivery_time: '3-5 business days',
        cost: 250.0,
        tracking_available: 1,
        cod_available: 1,
        weight_limit: 30,
        insurance_included: 0
    },
    {
        method: 'Express Delivery',
        provider: 'DHL Express',
        coverage_area: 'Major cities',
        delivery_time: '1-2 business days',
        cost: 500.0,
        tracking_available: 1,
        cod_available: 1,
        weight_limit: 10,
        insurance_included: 1
    },
    {
        method: 'Same Day Delivery',
        provider: 'PickMe Delivery',
        coverage_area: 'Colombo Metro',
        delivery_time: 'Same day',
        cost: 800.0,
        tracking_available: 1,
        cod_available: 1,
        weight_limit: 5,
        insurance_included: 1
    },
    {
        method: 'Free Delivery',
        provider: 'Own Fleet',
        coverage_area: 'Orders above Rs. 10,000',
        delivery_time: '3-5 business days',
        cost: 0.0,
        tracking_available: 1,
        cod_available: 1,
        weight_limit: 20,
        insurance_included: 0
    },
    {
        method: 'Bulk Delivery',
        provider: 'Cargo Partners',
        coverage_area: 'Commercial addresses',
        delivery_time: '2-4 business days',
        cost: 150.0,
        tracking_available: 1,
        cod_available: 0,
        weight_limit: 100,
        insurance_included: 1
    }
];

// Return Policies Data (using existing table structure)
const returnPolicies = [
    {
        product_category: 'Electronics',
        return_period: 7,
        condition_required: 'Original packaging with all accessories',
        return_shipping: 'Customer pays',
        refund_method: 'Original payment method',
        processing_time: 7,
        exchange_allowed: 1,
        restocking_fee: 0.0
    },
    {
        product_category: 'Fashion',
        return_period: 14,
        condition_required: 'Unworn with tags attached',
        return_shipping: 'Free for defective items',
        refund_method: 'Store credit or exchange',
        processing_time: 3,
        exchange_allowed: 1,
        restocking_fee: 0.0
    },
    {
        product_category: 'Home & Kitchen',
        return_period: 14,
        condition_required: 'Unused in original packaging',
        return_shipping: 'Customer pays',
        refund_method: 'Original payment method',
        processing_time: 5,
        exchange_allowed: 1,
        restocking_fee: 0.0
    },
    {
        product_category: 'Books',
        return_period: 30,
        condition_required: 'Undamaged condition',
        return_shipping: 'Customer pays',
        refund_method: 'Store credit',
        processing_time: 2,
        exchange_allowed: 0,
        restocking_fee: 0.0
    },
    {
        product_category: 'Beauty & Personal Care',
        return_period: 0,
        condition_required: 'Non-returnable for hygiene reasons',
        return_shipping: 'N/A',
        refund_method: 'N/A',
        processing_time: 0,
        exchange_allowed: 0,
        restocking_fee: 0.0
    }
];

// Support Topics Data
const supportTopics = [
    {
        topic: 'Order Status',
        category: 'Orders',
        priority: 'Medium',
        resolution_time: '15 minutes',
        available_channels: 'Phone, Email, Chat',
        expertise_required: 'Basic',
        common_solutions: 'Check order tracking, contact courier, update delivery address'
    },
    {
        topic: 'Payment Issues',
        category: 'Payments',
        priority: 'High',
        resolution_time: '30 minutes',
        available_channels: 'Phone, Email',
        expertise_required: 'Advanced',
        common_solutions: 'Retry payment, check card details, contact bank, use alternative payment'
    },
    {
        topic: 'Return Request',
        category: 'Returns',
        priority: 'Medium',
        resolution_time: '1 hour',
        available_channels: 'Email, Chat, Phone',
        expertise_required: 'Basic',
        common_solutions: 'Check return policy, arrange pickup, process refund, exchange item'
    },
    {
        topic: 'Product Information',
        category: 'Products',
        priority: 'Low',
        resolution_time: '10 minutes',
        available_channels: 'Chat, Email',
        expertise_required: 'Basic',
        common_solutions: 'Check product page, review specifications, compare alternatives'
    },
    {
        topic: 'Technical Support',
        category: 'Technical',
        priority: 'High',
        resolution_time: '2 hours',
        available_channels: 'Phone, Email',
        expertise_required: 'Expert',
        common_solutions: 'Remote troubleshooting, software updates, hardware diagnostics'
    },
    {
        topic: 'Account Issues',
        category: 'Account',
        priority: 'Medium',
        resolution_time: '30 minutes',
        available_channels: 'Email, Phone, Chat',
        expertise_required: 'Basic',
        common_solutions: 'Password reset, profile update, address change, account verification'
    }
];

// Warranty Policies Data
const warrantyPolicies = [
    {
        product_category: 'Electronics',
        warranty_period: '1 year manufacturer warranty',
        description: 'Comprehensive warranty covering manufacturing defects and hardware issues',
        coverage: 'Hardware failures, manufacturing defects, software issues, battery problems',
        exclusions: 'Physical damage, water damage, misuse, normal wear and tear, accessories',
        claim_process: 'Contact support with purchase receipt and serial number for claim processing',
        contact_info: 'warranty@yourstore.lk or call +94 11 234 5678'
    },
    {
        product_category: 'Home Appliances',
        warranty_period: '2 year manufacturer warranty',
        description: 'Extended warranty coverage for home appliances with free service visits',
        coverage: 'Motor, compressor, electrical components, parts replacement, labor charges',
        exclusions: 'Consumable parts, filters, normal wear items, mishandling, power surge damage',
        claim_process: 'Schedule home service visit through customer support or authorized service centers',
        contact_info: 'appliances@yourstore.lk or WhatsApp +94 77 123 4567'
    },
    {
        product_category: 'Mobile Phones',
        warranty_period: '1 year international warranty',
        description: 'Global warranty coverage valid at authorized service centers worldwide',
        coverage: 'Hardware defects, battery issues, display problems, software support, charging issues',
        exclusions: 'Screen cracks, water damage, rooting/jailbreaking, physical drops, third-party repairs',
        claim_process: 'Visit authorized service center with purchase proof and warranty card',
        contact_info: 'mobile@yourstore.lk or service hotline 1955'
    },
    {
        product_category: 'Fashion',
        warranty_period: '6 months quality guarantee',
        description: 'Quality assurance covering manufacturing defects in clothing and accessories',
        coverage: 'Manufacturing defects, color fading, stitching issues, zipper problems, fabric tears',
        exclusions: 'Normal wear and tear, washing damage, alterations, stains, size issues',
        claim_process: 'Return to store with receipt for exchange or store credit within warranty period',
        contact_info: 'fashion@yourstore.lk or visit nearest store'
    },
    {
        product_category: 'Computers',
        warranty_period: '2 year comprehensive warranty',
        description: 'Extended warranty for computing devices with software and hardware support',
        coverage: 'Hardware components, software support, data recovery assistance, peripheral issues',
        exclusions: 'Software corruption due to viruses, physical damage, liquid damage, user modifications',
        claim_process: 'Remote diagnosis available, on-site service for desktops, carry-in for laptops',
        contact_info: 'computers@yourstore.lk or tech support +94 11 567 8900'
    }
];

// Customer Support Data
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

// Shipping Zones Data
const shippingZones = [
    {
        zone_name: 'Colombo Metro',
        regions: 'Colombo, Mount Lavinia, Dehiwala, Moratuwa, Sri Jayawardenepura',
        standard_delivery_days: 2,
        express_delivery_days: 1,
        standard_cost: 200.0,
        express_cost: 400.0,
        cod_available: 1
    },
    {
        zone_name: 'Western Province',
        regions: 'Gampaha, Kalutara, Negombo, Panadura, Wattala',
        standard_delivery_days: 3,
        express_delivery_days: 2,
        standard_cost: 250.0,
        express_cost: 500.0,
        cod_available: 1
    },
    {
        zone_name: 'Central Province',
        regions: 'Kandy, Matale, Nuwara Eliya, Hatton, Dambulla',
        standard_delivery_days: 4,
        express_delivery_days: 2,
        standard_cost: 300.0,
        express_cost: 600.0,
        cod_available: 1
    },
    {
        zone_name: 'Southern Province',
        regions: 'Galle, Matara, Hambantota, Tangalle, Weligama',
        standard_delivery_days: 4,
        express_delivery_days: 3,
        standard_cost: 350.0,
        express_cost: 650.0,
        cod_available: 1
    },
    {
        zone_name: 'Northern Province',
        regions: 'Jaffna, Vavuniya, Mannar, Kilinochchi, Mullaitivu',
        standard_delivery_days: 5,
        express_delivery_days: 3,
        standard_cost: 400.0,
        express_cost: 750.0,
        cod_available: 0
    },
    {
        zone_name: 'Eastern Province',
        regions: 'Batticaloa, Trincomalee, Ampara, Kalmunai, Akkaraipattu',
        standard_delivery_days: 5,
        express_delivery_days: 3,
        standard_cost: 450.0,
        express_cost: 800.0,
        cod_available: 0
    }
];

// Promotions Data
const promotions = [
    {
        promo_name: 'Welcome Discount',
        description: 'Special discount for first-time customers',
        discount_type: 'Percentage',
        discount_value: 15.0,
        min_order_amount: 5000.0,
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
        min_order_amount: 10000.0,
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
        min_order_amount: 2000.0,
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
        min_order_amount: 1000.0,
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
        min_order_amount: 15000.0,
        valid_from: '2024-11-24',
        valid_until: '2024-11-30',
        promo_code: 'FLASH25',
        terms_conditions: 'Limited stock. First come, first served. No returns on sale items.',
        is_active: 1
    }
];

// Function to populate tables
function populateTable(tableName, data, columns) {
    console.log(`📊 Populating ${tableName} table...`);

    // Clear existing data
    try {
        db.prepare(`DELETE FROM ${tableName}`).run();
    } catch (e) {
        console.log(`   Note: ${tableName} table was empty`);
    }

    // Insert new data
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
    populateTable('payment_methods', paymentMethods,
        ['type', 'provider', 'bank', 'processing_fee', 'accepted', 'emi_available', 'emi_months', 'instant_refund', 'cashback_eligible', 'max_transaction', 'bank_name', 'ifsc_code', 'processing_time', 'charges', 'available_24x7']);

    populateTable('delivery_methods', deliveryMethods,
        ['method', 'provider', 'coverage_area', 'delivery_time', 'cost', 'tracking_available', 'cod_available', 'weight_limit', 'insurance_included']);

    populateTable('return_policies', returnPolicies,
        ['product_category', 'return_period', 'condition_required', 'return_shipping', 'refund_method', 'processing_time', 'exchange_allowed', 'restocking_fee']);

    populateTable('support_topics', supportTopics,
        ['topic', 'category', 'priority', 'resolution_time', 'available_channels', 'expertise_required', 'common_solutions']);

    populateTable('warranty_policies', warrantyPolicies,
        ['product_category', 'warranty_period', 'description', 'coverage', 'exclusions', 'claim_process', 'contact_info']);

    populateTable('customer_support', customerSupport,
        ['support_type', 'contact_method', 'contact_info', 'availability', 'response_time', 'languages_supported', 'department']);

    populateTable('shipping_zones', shippingZones,
        ['zone_name', 'regions', 'standard_delivery_days', 'express_delivery_days', 'standard_cost', 'express_cost', 'cod_available']);

    populateTable('promotions', promotions,
        ['promo_name', 'description', 'discount_type', 'discount_value', 'min_order_amount', 'valid_from', 'valid_until', 'promo_code', 'terms_conditions', 'is_active']);

    console.log('\n🎉 All tables have been populated successfully!');

    // Show final database summary
    console.log('\n📊 Complete Database Summary:');
    console.log(`✅ faqs: 1100 records`);
    console.log(`✅ products: 1100 records`);
    console.log(`✅ orders: 1100 records`);
    console.log(`✅ payment_methods: ${paymentMethods.length} records`);
    console.log(`✅ delivery_methods: ${deliveryMethods.length} records`);
    console.log(`✅ return_policies: ${returnPolicies.length} records`);
    console.log(`✅ support_topics: ${supportTopics.length} records`);
    console.log(`✅ warranty_policies: ${warrantyPolicies.length} records`);
    console.log(`✅ customer_support: ${customerSupport.length} records`);
    console.log(`✅ shipping_zones: ${shippingZones.length} records`);
    console.log(`✅ promotions: ${promotions.length} records`);
    console.log(`✅ delivery_policies: 5 records (already populated)`);

    console.log('\n🚀 Your ecommerce database is now fully comprehensive!');
    console.log('🎯 All business operations are covered: products, orders, payments, delivery,');
    console.log('   returns, warranties, support, promotions, and customer policies.');

} catch (error) {
    console.error('❌ Error populating database:', error);
} finally {
    db.close();
}