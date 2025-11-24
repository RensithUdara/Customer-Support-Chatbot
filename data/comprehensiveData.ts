// Comprehensive database with 1000+ entries for each category
export const comprehensiveData = {
  // 1000+ FAQs covering all aspects
  faqs: [
    // Order & Shipping FAQs (250 entries)
    ...Array.from({ length: 250 }, (_, i) => ({
      question: `Order tracking FAQ ${i + 1}: How do I track my order with reference #ORD${String(i + 1).padStart(6, '0')}?`,
      answer: `You can track your order #ORD${String(i + 1).padStart(6, '0')} by logging into your account and visiting the 'My Orders' section, or use our order tracking tool with your order number and email address.`,
      category: 'ORDER_TRACKING',
      tags: ['tracking', 'orders', 'delivery', 'status']
    })),
    
    // Payment FAQs (250 entries)
    ...Array.from({ length: 250 }, (_, i) => ({
      question: `Payment FAQ ${i + 1}: What payment methods do you accept for transaction ${i + 1}?`,
      answer: `We accept all major credit/debit cards, UPI payments (GPay, PhonePe, Paytm), net banking, digital wallets, and Cash on Delivery (COD) for eligible locations. EMI options available for purchases above ₹5,000.`,
      category: 'PAYMENT',
      tags: ['payment', 'cards', 'upi', 'cod', 'emi']
    })),
    
    // Return & Refund FAQs (250 entries)
    ...Array.from({ length: 250 }, (_, i) => ({
      question: `Return FAQ ${i + 1}: What is your return policy for item type ${i + 1}?`,
      answer: `We offer a 14-day return policy for most items and 7-day return for electronics. Items must be unused, in original packaging with all accessories. Free return pickup available for defective products.`,
      category: 'RETURNS',
      tags: ['returns', 'refund', 'policy', 'exchange']
    })),
    
    // Product Support FAQs (250 entries)
    ...Array.from({ length: 250 }, (_, i) => ({
      question: `Product FAQ ${i + 1}: How do I care for product category ${i + 1}?`,
      answer: `Detailed care instructions depend on the product type. Please refer to the product manual or contact our support team for specific care guidelines. Most electronics come with 6-12 month warranty.`,
      category: 'PRODUCT_SUPPORT',
      tags: ['product', 'care', 'warranty', 'support']
    }))
  ],

  // 1000+ Products across categories
  products: [
    // Electronics (300 entries)
    ...Array.from({ length: 300 }, (_, i) => ({
      name: `Electronic Device ${i + 1}`,
      description: `High-quality electronic device with advanced features. Model ED-${String(i + 1).padStart(4, '0')} offers excellent performance and reliability.`,
      price: 15000 + (i * 500),
      category: 'Electronics',
      stock: Math.floor(Math.random() * 100) + 10,
      rating: (4.0 + Math.random()).toFixed(1),
      brand: ['Samsung', 'Sony', 'LG', 'Panasonic', 'Philips'][i % 5],
      warranty: '12 months',
      features: ['HD Display', 'Energy Efficient', 'Smart Features', 'Durable Design']
    })),
    
    // Clothing (250 entries)
    ...Array.from({ length: 250 }, (_, i) => ({
      name: `Fashion Item ${i + 1}`,
      description: `Trendy and comfortable clothing item. Style FI-${String(i + 1).padStart(4, '0')} made from premium materials.`,
      price: 800 + (i * 200),
      category: 'Clothing',
      stock: Math.floor(Math.random() * 50) + 5,
      rating: (3.8 + Math.random() * 1.2).toFixed(1),
      brand: ['Zara', 'H&M', 'Levi\'s', 'Nike', 'Adidas'][i % 5],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Black', 'White', 'Blue', 'Red', 'Green', 'Gray']
    })),
    
    // Home & Garden (250 entries)
    ...Array.from({ length: 250 }, (_, i) => ({
      name: `Home Essential ${i + 1}`,
      description: `Essential home and garden item. Product HE-${String(i + 1).padStart(4, '0')} designed for modern living.`,
      price: 1200 + (i * 300),
      category: 'Home & Garden',
      stock: Math.floor(Math.random() * 75) + 15,
      rating: (4.2 + Math.random() * 0.8).toFixed(1),
      brand: ['IKEA', 'HomeCenter', 'Urban Ladder', 'Pepperfry', 'Godrej'][i % 5],
      material: ['Wood', 'Metal', 'Plastic', 'Glass', 'Ceramic'][i % 5],
      warranty: '6 months'
    })),
    
    // Books (200 entries)
    ...Array.from({ length: 200 }, (_, i) => ({
      name: `Book Title ${i + 1}`,
      description: `Engaging and informative book. ISBN: 978-${String(i + 1).padStart(10, '0')} by renowned authors.`,
      price: 200 + (i * 50),
      category: 'Books',
      stock: Math.floor(Math.random() * 30) + 5,
      rating: (4.0 + Math.random() * 1.0).toFixed(1),
      author: [`Author ${i + 1}`, `Writer ${i + 1}`][i % 2],
      genre: ['Fiction', 'Non-Fiction', 'Science', 'History', 'Biography'][i % 5],
      pages: 150 + (i * 2),
      publisher: ['Penguin', 'HarperCollins', 'Random House', 'Macmillan', 'Oxford'][i % 5]
    }))
  ],

  // 1000+ Orders with realistic data
  orders: [
    ...Array.from({ length: 1000 }, (_, i) => {
      const orderDate = new Date();
      orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 90)); // Orders from last 90 days
      
      const statuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
      const paymentMethods = ['Credit Card', 'UPI', 'COD', 'Debit Card', 'Net Banking', 'Wallet'];
      const cities = ['Colombo', 'Kandy', 'Galle', 'Jaffna', 'Negombo', 'Trincomalee', 'Batticaloa', 'Ratnapura'];
      
      return {
        orderId: `ORD${String(i + 1).padStart(6, '0')}`,
        customerId: `CUST${String(Math.floor(Math.random() * 5000) + 1).padStart(5, '0')}`,
        customerName: `Customer ${i + 1}`,
        customerEmail: `customer${i + 1}@example.com`,
        customerPhone: `+94${String(Math.floor(Math.random() * 1000000000)).padStart(9, '0')}`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        orderDate: orderDate.toISOString().split('T')[0],
        totalAmount: 1500 + (Math.random() * 50000),
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        shippingAddress: `${i + 1} Main Street, ${cities[Math.floor(Math.random() * cities.length)]}, Sri Lanka`,
        trackingNumber: `TRK${String(i + 1).padStart(8, '0')}`,
        estimatedDelivery: new Date(orderDate.getTime() + (Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        items: [
          {
            productName: `Product ${Math.floor(Math.random() * 1000) + 1}`,
            quantity: Math.floor(Math.random() * 5) + 1,
            price: 500 + (Math.random() * 10000)
          }
        ]
      };
    })
  ],

  // 1000+ Payment Methods & Options
  paymentMethods: [
    // Credit Cards (200 entries)
    ...Array.from({ length: 200 }, (_, i) => ({
      id: i + 1,
      type: 'Credit Card',
      provider: ['Visa', 'Mastercard', 'American Express', 'Diners Club'][i % 4],
      bank: ['Commercial Bank', 'People\'s Bank', 'Bank of Ceylon', 'Sampath Bank', 'HNB'][i % 5],
      processing_fee: (Math.random() * 2).toFixed(2),
      accepted: true,
      emi_available: i % 2 === 0,
      emi_months: [3, 6, 9, 12, 18, 24]
    })),
    
    // UPI & Digital Wallets (300 entries)
    ...Array.from({ length: 300 }, (_, i) => ({
      id: i + 201,
      type: 'Digital Payment',
      provider: ['GooglePay', 'PhonePe', 'Paytm', 'FreeCharge', 'MobiKwik'][i % 5],
      processing_fee: 0,
      instant_refund: true,
      cashback_eligible: i % 3 === 0,
      max_transaction: 100000 + (i * 1000)
    })),
    
    // Bank Options (500 entries)
    ...Array.from({ length: 500 }, (_, i) => ({
      id: i + 501,
      type: 'Net Banking',
      bank_name: `Bank ${i + 1}`,
      ifsc_code: `BANK${String(i + 1).padStart(7, '0')}`,
      processing_time: '24-48 hours',
      charges: Math.random() < 0.5 ? 'Free' : `₹${Math.floor(Math.random() * 20) + 5}`,
      available_24x7: i % 4 !== 0
    }))
  ],

  // 1000+ Delivery Options
  deliveryMethods: [
    ...Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      method: ['Standard', 'Express', 'Same Day', 'Next Day'][i % 4],
      provider: ['DHL', 'FedEx', 'Blue Dart', 'DTDC', 'India Post'][i % 5],
      coverage_area: `Area ${i + 1}`,
      delivery_time: ['3-5 days', '1-2 days', 'Same day', 'Next day'][i % 4],
      cost: i % 4 === 0 ? 0 : 50 + (Math.random() * 200),
      tracking_available: true,
      cod_available: i % 3 !== 0,
      weight_limit: 5 + (i % 20),
      insurance_included: i % 2 === 0
    }))
  ],

  // 1000+ Return Policies
  returnPolicies: [
    ...Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      product_category: ['Electronics', 'Clothing', 'Books', 'Home & Garden'][i % 4],
      return_period: [7, 14, 21, 30][i % 4],
      condition_required: ['Unopened', 'Original packaging', 'With accessories', 'Unused'][i % 4],
      return_shipping: i % 2 === 0 ? 'Free' : 'Customer pays',
      refund_method: ['Original payment method', 'Store credit', 'Bank transfer'][i % 3],
      processing_time: [3, 5, 7, 10][i % 4],
      exchange_allowed: i % 3 !== 0,
      restocking_fee: i % 5 === 0 ? Math.floor(Math.random() * 10) + 5 : 0
    }))
  ],

  // 1000+ Support Topics
  supportTopics: [
    ...Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      topic: `Support Topic ${i + 1}`,
      category: ['Technical', 'Billing', 'Shipping', 'Returns', 'General'][i % 5],
      priority: ['Low', 'Medium', 'High', 'Critical'][Math.floor(Math.random() * 4)],
      resolution_time: ['1 hour', '24 hours', '48 hours', '72 hours'][i % 4],
      available_channels: ['Chat', 'Email', 'Phone', 'WhatsApp'],
      expertise_required: ['Level 1', 'Level 2', 'Level 3'][Math.floor(Math.random() * 3)],
      common_solutions: [
        'Check account settings',
        'Verify payment method',
        'Contact support team',
        'Follow troubleshooting guide'
      ]
    }))
  ]
};