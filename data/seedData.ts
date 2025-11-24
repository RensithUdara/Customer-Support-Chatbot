// Seed data for the e-commerce database
export const faqData = [
  // Orders Category
  {
    category: 'Orders',
    question_example: 'How can I track my order?',
    answer_text: 'You can track your order by entering your order number in our tracking system. You will also receive email updates when your order status changes. Orders typically take 3-7 business days to deliver.'
  },
  {
    category: 'Orders',
    question_example: 'Can I cancel my order?',
    answer_text: 'You can cancel your order within 1 hour of placing it if it hasn\'t been shipped yet. After that, you can return the item once delivered using our return policy.'
  },
  {
    category: 'Orders',
    question_example: 'What are your delivery charges?',
    answer_text: 'We offer free delivery on orders above ₹999. For orders below ₹999, delivery charges are ₹99 for metro cities and ₹149 for other locations.'
  },
  {
    category: 'Orders',
    question_example: 'When will my order be delivered?',
    answer_text: 'Standard delivery takes 3-7 business days. Express delivery (available in metro cities) takes 1-2 business days for an additional ₹199.'
  },
  
  // Returns Category
  {
    category: 'Returns',
    question_example: 'What is your return policy?',
    answer_text: 'We offer a 15-day return policy from the date of delivery. Items must be in original condition with tags intact. Electronics have a 7-day return window.'
  },
  {
    category: 'Returns',
    question_example: 'How do I return an item?',
    answer_text: 'To return an item, go to "My Orders" and select "Return Item". Our delivery partner will pick up the item from your address at no extra cost. Refunds are processed within 5-7 business days.'
  },
  {
    category: 'Returns',
    question_example: 'Can I exchange an item?',
    answer_text: 'Yes, you can exchange items for a different size or color within the return window. The exchange is subject to availability and price difference, if any.'
  },
  
  // Payments Category
  {
    category: 'Payments',
    question_example: 'What payment methods do you accept?',
    answer_text: 'We accept all major credit/debit cards, UPI, net banking, and digital wallets. We also offer Cash on Delivery (COD) for orders up to ₹50,000.'
  },
  {
    category: 'Payments',
    question_example: 'Do you offer Cash on Delivery?',
    answer_text: 'Yes, we offer Cash on Delivery (COD) for orders up to ₹50,000. COD charges are ₹49 for orders below ₹999.'
  },
  {
    category: 'Payments',
    question_example: 'Is it safe to pay online?',
    answer_text: 'Yes, all online payments are secured with SSL encryption and processed through trusted payment gateways. We never store your payment information.'
  },
  
  // Warranty Category
  {
    category: 'Warranty',
    question_example: 'Do products come with warranty?',
    answer_text: 'All electronic products come with manufacturer warranty. Warranty period varies by product - typically 1 year for electronics and 6 months for accessories.'
  },
  {
    category: 'Warranty',
    question_example: 'How do I claim warranty?',
    answer_text: 'For warranty claims, contact our customer service with your order number and issue description. We will coordinate with the brand for repair or replacement.'
  },
  
  // Account Category
  {
    category: 'Account',
    question_example: 'How do I create an account?',
    answer_text: 'You can create an account by clicking "Sign Up" and entering your email and phone number. You can also shop as a guest without creating an account.'
  },
  {
    category: 'Account',
    question_example: 'I forgot my password',
    answer_text: 'Click on "Forgot Password" on the login page and enter your email. You will receive a password reset link within a few minutes.'
  }
];

export const productsData = [
  // Mobile Phones
  {
    name: 'Samsung Galaxy A14 5G',
    category: 'Mobile',
    brand: 'Samsung',
    price: 16499,
    description: '6GB RAM, 128GB Storage, 50MP Triple Camera, 5000mAh Battery',
    tags: 'budget,5g,long battery,good camera'
  },
  {
    name: 'iPhone 15',
    category: 'Mobile',
    brand: 'Apple',
    price: 79900,
    description: '128GB, A16 Bionic Chip, 48MP Camera System, iOS 17',
    tags: 'premium,fast,excellent camera,ios'
  },
  {
    name: 'OnePlus Nord CE 3',
    category: 'Mobile',
    brand: 'OnePlus',
    price: 26999,
    description: '8GB RAM, 128GB Storage, 108MP Camera, 80W Fast Charging',
    tags: 'fast charging,good performance,camera'
  },
  {
    name: 'Xiaomi Redmi Note 12 Pro',
    category: 'Mobile',
    brand: 'Xiaomi',
    price: 23999,
    description: '6GB RAM, 128GB Storage, 50MP Camera, 67W Fast Charging',
    tags: 'fast charging,good camera,value for money'
  },
  {
    name: 'Realme 11 Pro',
    category: 'Mobile',
    brand: 'Realme',
    price: 25999,
    description: '8GB RAM, 256GB Storage, 100MP Camera, Curved Display',
    tags: 'curved display,large storage,good camera'
  },
  {
    name: 'POCO X5 Pro',
    category: 'Mobile',
    brand: 'POCO',
    price: 22999,
    description: '8GB RAM, 256GB Storage, Snapdragon 778G, 108MP Camera',
    tags: 'gaming,good performance,large storage'
  },
  {
    name: 'Vivo V29',
    category: 'Mobile',
    brand: 'Vivo',
    price: 32999,
    description: '8GB RAM, 128GB Storage, 50MP Selfie Camera, Slim Design',
    tags: 'selfie camera,slim,premium design'
  },
  {
    name: 'Oppo Reno 10',
    category: 'Mobile',
    brand: 'Oppo',
    price: 32999,
    description: '8GB RAM, 256GB Storage, 64MP Periscope Camera, ColorOS',
    tags: 'zoom camera,good display,premium'
  },
  
  // Laptops
  {
    name: 'HP Pavilion 15',
    category: 'Laptop',
    brand: 'HP',
    price: 45999,
    description: 'Intel i5-12th Gen, 8GB RAM, 512GB SSD, Windows 11',
    tags: 'student,office work,lightweight'
  },
  {
    name: 'Dell Inspiron 15 3000',
    category: 'Laptop',
    brand: 'Dell',
    price: 38999,
    description: 'Intel i3-12th Gen, 8GB RAM, 256GB SSD, 15.6 inch FHD',
    tags: 'budget,basic use,reliable'
  },
  {
    name: 'Lenovo IdeaPad Gaming 3',
    category: 'Laptop',
    brand: 'Lenovo',
    price: 65999,
    description: 'AMD Ryzen 5, 8GB RAM, 512GB SSD, GTX 1650, Gaming',
    tags: 'gaming,good graphics,performance'
  },
  {
    name: 'MacBook Air M2',
    category: 'Laptop',
    brand: 'Apple',
    price: 114900,
    description: 'Apple M2 Chip, 8GB RAM, 256GB SSD, 13.6 inch Retina',
    tags: 'premium,lightweight,excellent battery,creative work'
  },
  {
    name: 'Asus VivoBook 15',
    category: 'Laptop',
    brand: 'Asus',
    price: 42999,
    description: 'Intel i5-11th Gen, 8GB RAM, 512GB SSD, Backlit Keyboard',
    tags: 'student,office,good keyboard'
  },
  {
    name: 'Acer Aspire 7',
    category: 'Laptop',
    brand: 'Acer',
    price: 54999,
    description: 'Intel i5-12th Gen, 8GB RAM, 512GB SSD, GTX 1650, Gaming',
    tags: 'gaming,performance,good value'
  },
  
  // Accessories
  {
    name: 'Sony WH-CH720N',
    category: 'Headphones',
    brand: 'Sony',
    price: 9990,
    description: 'Wireless Noise Canceling Headphones, 35Hr Battery',
    tags: 'wireless,noise canceling,long battery'
  },
  {
    name: 'JBL Tune 230NC',
    category: 'Earphones',
    brand: 'JBL',
    price: 4999,
    description: 'True Wireless Earbuds, Active Noise Cancelling, IPX4',
    tags: 'wireless,noise canceling,water resistant'
  },
  {
    name: 'Apple Watch Series 9',
    category: 'Watch',
    brand: 'Apple',
    price: 41900,
    description: 'GPS, 41mm, Fitness Tracking, Always-On Retina Display',
    tags: 'fitness,premium,health tracking'
  },
  {
    name: 'Samsung Galaxy Watch 6',
    category: 'Watch',
    brand: 'Samsung',
    price: 32999,
    description: '40mm, GPS, Health Monitoring, 40+ Workout Modes',
    tags: 'fitness,health monitoring,android compatible'
  }
];

export const ordersData = [
  {
    id: 1001,
    customer_name: 'Rajesh Kumar',
    product_id: 1, // Samsung Galaxy A14 5G
    order_date: '2024-11-20',
    delivery_date: '2024-11-25',
    status: 'Processing'
  },
  {
    id: 1002,
    customer_name: 'Priya Sharma',
    product_id: 9, // HP Pavilion 15
    order_date: '2024-11-18',
    delivery_date: '2024-11-23',
    status: 'Shipped'
  },
  {
    id: 1003,
    customer_name: 'Amit Singh',
    product_id: 2, // iPhone 15
    order_date: '2024-11-15',
    delivery_date: '2024-11-20',
    status: 'Delivered'
  },
  {
    id: 1004,
    customer_name: 'Neha Gupta',
    product_id: 15, // Sony WH-CH720N
    order_date: '2024-11-22',
    delivery_date: '2024-11-27',
    status: 'Processing'
  },
  {
    id: 1005,
    customer_name: 'Vikram Patel',
    product_id: 11, // Lenovo IdeaPad Gaming 3
    order_date: '2024-11-19',
    delivery_date: '2024-11-24',
    status: 'Shipped'
  },
  {
    id: 1006,
    customer_name: 'Anita Reddy',
    product_id: 3, // OnePlus Nord CE 3
    order_date: '2024-11-10',
    delivery_date: '2024-11-15',
    status: 'Delivered'
  },
  {
    id: 1007,
    customer_name: 'Rohit Agarwal',
    product_id: 12, // MacBook Air M2
    order_date: '2024-11-21',
    delivery_date: '2024-11-26',
    status: 'Processing'
  },
  {
    id: 1008,
    customer_name: 'Kavya Nair',
    product_id: 16, // JBL Tune 230NC
    order_date: '2024-11-17',
    delivery_date: '2024-11-22',
    status: 'Shipped'
  },
  {
    id: 1009,
    customer_name: 'Suresh Yadav',
    product_id: 6, // POCO X5 Pro
    order_date: '2024-11-12',
    delivery_date: '2024-11-17',
    status: 'Delivered'
  },
  {
    id: 1010,
    customer_name: 'Deepika Shah',
    product_id: 13, // Asus VivoBook 15
    order_date: '2024-11-23',
    delivery_date: '2024-11-28',
    status: 'Processing'
  },
  {
    id: 1011,
    customer_name: 'Manish Joshi',
    product_id: 17, // Apple Watch Series 9
    order_date: '2024-11-16',
    delivery_date: '2024-11-21',
    status: 'Delivered'
  },
  {
    id: 1012,
    customer_name: 'Sneha Kapoor',
    product_id: 4, // Xiaomi Redmi Note 12 Pro
    order_date: '2024-11-20',
    delivery_date: '2024-11-25',
    status: 'Shipped'
  }
];