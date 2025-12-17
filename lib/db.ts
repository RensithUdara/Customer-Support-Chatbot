import Database from 'better-sqlite3';
import path from 'path';

// Create or connect to SQLite database
const db = new Database(path.join(process.cwd(), 'data', 'ecommerce.db'));

// Initialize database tables
export const initDatabase = () => {
  // Create FAQs table
  db.exec(`
    CREATE TABLE IF NOT EXISTS faqs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      category TEXT NOT NULL,
      tags TEXT
    )
  `);

  // Create products table
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      category TEXT NOT NULL,
      stock INTEGER DEFAULT 0,
      rating REAL,
      brand TEXT,
      warranty TEXT,
      features TEXT
    )
  `);

  // Create orders table
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      orderId TEXT NOT NULL,
      customerId TEXT,
      customerName TEXT NOT NULL,
      customerEmail TEXT,
      customerPhone TEXT,
      status TEXT NOT NULL,
      orderDate TEXT NOT NULL,
      totalAmount REAL,
      paymentMethod TEXT,
      shippingAddress TEXT,
      trackingNumber TEXT,
      estimatedDelivery TEXT,
      items TEXT
    )
  `);

  // Create conversations table (optional)
  db.exec(`
    CREATE TABLE IF NOT EXISTS conversations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      message TEXT NOT NULL,
      sender TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      intent TEXT
    )
  `);

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

  // Create feedback table for chatbot responses
  db.exec(`
    CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      message_id TEXT NOT NULL,
      bot_response TEXT,
      feedback_type TEXT NOT NULL,
      feedback_rating INTEGER,
      user_comment TEXT,
      intent TEXT,
      confidence REAL,
      timestamp TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create feedback summary table for real-time statistics
  db.exec(`
    CREATE TABLE IF NOT EXISTS feedback_summary (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      intent TEXT UNIQUE,
      like_count INTEGER DEFAULT 0,
      dislike_count INTEGER DEFAULT 0,
      total_count INTEGER DEFAULT 0,
      like_percentage REAL DEFAULT 0,
      dislike_percentage REAL DEFAULT 0,
      last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

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
};

// Database helper functions
export const getFAQs = () => {
  return db.prepare('SELECT * FROM faqs').all();
};

export const searchFAQs = (keywords: string[]) => {
  const query = keywords.map(k => `question LIKE '%${k}%' OR answer LIKE '%${k}%' OR category LIKE '%${k}%'`).join(' OR ');
  return db.prepare(`SELECT * FROM faqs WHERE ${query} LIMIT 3`).all();
};

// Advanced FAQ search that returns best exact match
export const searchBestFAQ = (message: string, keywords: string[]) => {
  // First try exact question match
  const exactMatch = db.prepare('SELECT * FROM faqs WHERE question = ?').get(message);
  if (exactMatch) return exactMatch;

  const messageLower = message.toLowerCase();

  // Special handling for common delivery queries
  const deliveryMappings = [
    { patterns: ['international delivery', 'ship internationally', 'overseas shipping', 'abroad'], searchFor: 'ship internationally' },
    { patterns: ['express delivery', 'express shipping', 'fast delivery'], searchFor: 'express shipping' },
    { patterns: ['same day delivery', 'same-day delivery', 'today delivery'], searchFor: 'same-day delivery' },
    { patterns: ['delivery charges', 'shipping charges', 'delivery cost', 'shipping cost'], searchFor: 'shipping charges' },
    { patterns: ['bulk delivery', 'wholesale delivery', 'large orders'], searchFor: 'bulk delivery' },
    { patterns: ['delivery address', 'shipping address', 'change address'], searchFor: 'delivery address' },
    { patterns: ['delivery time', 'schedule delivery', 'time slot'], searchFor: 'schedule' },
    { patterns: ['not home', 'absent during delivery', 'redelivery'], searchFor: 'not home' },
    { patterns: ['delivery updates', 'track delivery', 'delivery status'], searchFor: 'delivery updates' },
    { patterns: ['delivery times', 'how long delivery'], searchFor: 'delivery times' }
  ];

  // Check for delivery pattern matches
  for (const mapping of deliveryMappings) {
    if (mapping.patterns.some(pattern => messageLower.includes(pattern))) {
      const directMatch = db.prepare('SELECT * FROM faqs WHERE question LIKE ?').get(`%${mapping.searchFor}%`);
      if (directMatch) return directMatch;
    }
  }

  // Then try keyword-based search with simple scoring
  if (keywords.length === 0) return null;

  const keywordQuery = keywords.map(() => `question LIKE ? OR answer LIKE ? OR category LIKE ?`).join(' OR ');
  const params = keywords.flatMap(k => [`%${k}%`, `%${k}%`, `%${k}%`]);

  const bestMatch = db.prepare(`
    SELECT * FROM faqs 
    WHERE ${keywordQuery}
    ORDER BY 
      CASE 
        WHEN question LIKE ? THEN 1
        WHEN answer LIKE ? THEN 2
        ELSE 3
      END,
      id ASC
    LIMIT 1
  `).get(...params, `%${keywords[0]}%`, `%${keywords[0]}%`);

  return bestMatch;
};

// Search FAQs by category
export const searchFAQsByCategory = (category: string) => {
  return db.prepare('SELECT * FROM faqs WHERE category = ? LIMIT 5').all(category);
};

export const getProducts = () => {
  return db.prepare('SELECT * FROM products').all();
};

export const searchProducts = (category?: string, maxPrice?: number, tags?: string) => {
  let query = 'SELECT * FROM products WHERE 1=1';
  const params: any[] = [];

  if (category) {
    query += ' AND category LIKE ?';
    params.push(`%${category}%`);
  }

  if (maxPrice) {
    query += ' AND price <= ?';
    params.push(maxPrice);
  }

  if (tags) {
    query += ' AND (brand LIKE ? OR features LIKE ?)';
    params.push(`%${tags}%`, `%${tags}%`);
  }

  query += ' LIMIT 5';

  return db.prepare(query).all(...params);
};

export const getOrderById = (orderId: string) => {
  // Simply get the order by ID - items are already stored as JSON
  const query = `SELECT * FROM orders WHERE orderId = ?`;
  return db.prepare(query).get(orderId);
};

export const saveConversation = (sessionId: string, message: string, sender: 'user' | 'bot', intent?: string) => {
  const stmt = db.prepare(`
    INSERT INTO conversations (session_id, message, sender, timestamp, intent)
    VALUES (?, ?, ?, ?, ?)
  `);
  return stmt.run(sessionId, message, sender, new Date().toISOString(), intent);
};

// Get conversation history for context-aware responses
export const getConversationHistory = (sessionId: string, limit: number = 10) => {
  return db.prepare(`
    SELECT * FROM conversations 
    WHERE session_id = ? 
    ORDER BY timestamp DESC 
    LIMIT ?
  `).all(sessionId, limit).reverse(); // Reverse to get chronological order
};

// Helper functions for new tables
export const getDeliveryPolicies = () => {
  return db.prepare('SELECT * FROM delivery_policies WHERE is_active = 1').all();
};

export const getReturnPolicies = () => {
  return db.prepare('SELECT * FROM return_policies').all();
};

export const getPaymentMethods = () => {
  return db.prepare('SELECT * FROM payment_methods WHERE accepted = 1').all();
};

export const getWarrantyPolicies = () => {
  return db.prepare('SELECT * FROM warranty_policies').all();
};

export const getCustomerSupport = () => {
  return db.prepare('SELECT * FROM customer_support').all();
};

export const getShippingZones = () => {
  return db.prepare('SELECT * FROM shipping_zones').all();
};

export const getActivePromotions = () => {
  return db.prepare('SELECT * FROM promotions WHERE is_active = 1').all();
};

export const searchDeliveryPolicies = (keyword: string) => {
  return db.prepare(`
    SELECT * FROM delivery_policies 
    WHERE is_active = 1 AND (policy_name LIKE ? OR description LIKE ?)
  `).all(`%${keyword}%`, `%${keyword}%`);
};

export const searchReturnPolicies = (keyword: string) => {
  return db.prepare(`
    SELECT * FROM return_policies 
    WHERE product_category LIKE ? OR condition_required LIKE ?
  `).all(`%${keyword}%`, `%${keyword}%`);
};

// Additional helper functions for new tables
export const getDeliveryMethods = () => {
  return db.prepare('SELECT * FROM delivery_methods').all();
};

export const getReturnPoliciesByCategory = (category: string) => {
  return db.prepare('SELECT * FROM return_policies WHERE product_category LIKE ?').all(`%${category}%`);
};

export const getReturnFAQs = () => {
  return db.prepare('SELECT * FROM faqs WHERE question LIKE ? OR question LIKE ? OR question LIKE ?').all('%return%', '%refund%', '%exchange%');
};

export const getSupportTopics = () => {
  return db.prepare('SELECT * FROM support_topics').all();
};

export const searchPaymentMethods = (keyword: string) => {
  return db.prepare(`
    SELECT * FROM payment_methods 
    WHERE accepted = 1 AND (type LIKE ? OR provider LIKE ?)
  `).all(`%${keyword}%`, `%${keyword}%`);
};

export const searchWarrantyPolicies = (category: string) => {
  return db.prepare(`
    SELECT * FROM warranty_policies 
    WHERE product_category LIKE ?
  `).all(`%${category}%`);
};

export const searchCustomerSupport = (type: string) => {
  return db.prepare(`
    SELECT * FROM customer_support 
    WHERE support_type LIKE ? OR department LIKE ?
  `).all(`%${type}%`, `%${type}%`);
};

export const getShippingZoneByRegion = (region: string) => {
  return db.prepare(`
    SELECT * FROM shipping_zones 
    WHERE regions LIKE ?
  `).all(`%${region}%`);
};

export const searchPromotions = (keyword: string) => {
  return db.prepare(`
    SELECT * FROM promotions 
    WHERE is_active = 1 AND (promo_name LIKE ? OR description LIKE ? OR promo_code LIKE ?)
  `).all(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
};

// Comprehensive database query functions for any table data
export const getAllPaymentMethods = () => {
  return db.prepare('SELECT * FROM payment_methods WHERE accepted = 1').all();
};

export const getAllWarrantyPolicies = () => {
  return db.prepare('SELECT * FROM warranty_policies').all();
};

export const getAllShippingZones = () => {
  return db.prepare('SELECT * FROM shipping_zones').all();
};

export const getAllPromotions = () => {
  return db.prepare('SELECT * FROM promotions WHERE is_active = 1').all();
};

export const getAllCustomerSupport = () => {
  return db.prepare('SELECT * FROM customer_support').all();
};

// Get specific customer support method
export const getSpecificCustomerSupport = (supportType: string) => {
  return db.prepare(`
    SELECT * FROM customer_support
    WHERE LOWER(support_type) LIKE ? OR LOWER(contact_method) LIKE ?
    ORDER BY id
  `).all(`%${supportType.toLowerCase()}%`, `%${supportType.toLowerCase()}%`);
};

export const getProductCategories = () => {
  return db.prepare('SELECT DISTINCT category FROM products ORDER BY category').all();
};

export const getProductsByCategory = (category: string) => {
  return db.prepare('SELECT * FROM products WHERE category LIKE ? LIMIT 10').all(`%${category}%`);
};

export const getOrderStatistics = () => {
  return db.prepare(`
    SELECT 
      status,
      COUNT(*) as count,
      AVG(totalAmount) as avg_amount
    FROM orders 
    GROUP BY status
  `).all();
};

// Smart database query based on keywords
export const smartDatabaseQuery = (message: string) => {
  const lowercaseMessage = message.toLowerCase();

  // Payment methods queries
  if (lowercaseMessage.includes('payment') || lowercaseMessage.includes('pay')) {
    return { type: 'payment_methods', data: getAllPaymentMethods() };
  }

  // Warranty queries
  if (lowercaseMessage.includes('warranty') || lowercaseMessage.includes('guarantee')) {
    return { type: 'warranty', data: getAllWarrantyPolicies() };
  }

  // Shipping zones
  if (lowercaseMessage.includes('shipping zone') || lowercaseMessage.includes('delivery area')) {
    return { type: 'shipping_zones', data: getAllShippingZones() };
  }

  // Promotions
  if (lowercaseMessage.includes('promotion') || lowercaseMessage.includes('offer') || lowercaseMessage.includes('discount')) {
    return { type: 'promotions', data: getAllPromotions() };
  }

  // Specific customer support methods
  if (lowercaseMessage.includes('whatsapp support') || lowercaseMessage.includes('whatsapp contact')) {
    return { type: 'specific_support', data: getSpecificCustomerSupport('whatsapp'), supportType: 'WhatsApp Support' };
  }
  if (lowercaseMessage.includes('phone support') || lowercaseMessage.includes('phone contact')) {
    return { type: 'specific_support', data: getSpecificCustomerSupport('phone'), supportType: 'Phone Support' };
  }
  if (lowercaseMessage.includes('email support') || lowercaseMessage.includes('email contact')) {
    return { type: 'specific_support', data: getSpecificCustomerSupport('email'), supportType: 'Email Support' };
  }
  if (lowercaseMessage.includes('live chat') || lowercaseMessage.includes('chat support')) {
    return { type: 'specific_support', data: getSpecificCustomerSupport('chat'), supportType: 'Live Chat Support' };
  }
  if (lowercaseMessage.includes('technical support') || lowercaseMessage.includes('tech support')) {
    return { type: 'specific_support', data: getSpecificCustomerSupport('technical'), supportType: 'Technical Support' };
  }
  if (lowercaseMessage.includes('returns support') || lowercaseMessage.includes('return support')) {
    return { type: 'specific_support', data: getSpecificCustomerSupport('returns'), supportType: 'Returns Support' };
  }

  // General customer support (all methods)
  if (lowercaseMessage.includes('customer support') || lowercaseMessage.includes('contact') || lowercaseMessage.includes('help desk')) {
    return { type: 'customer_support', data: getAllCustomerSupport() };
  }

  // Support topics
  if (lowercaseMessage.includes('support topic') || lowercaseMessage.includes('help topic')) {
    return { type: 'support_topics', data: getSupportTopics() };
  }

  // Product categories
  if (lowercaseMessage.includes('product categories') || lowercaseMessage.includes('categories') || lowercaseMessage.includes('what products')) {
    return { type: 'product_categories', data: getProductCategories() };
  }

  // Order statistics
  if (lowercaseMessage.includes('order stat') || lowercaseMessage.includes('how many order')) {
    return { type: 'order_statistics', data: getOrderStatistics() };
  }

  // Default: return general store info
  return { type: 'general_info', data: null };
};

// ============================================
// Feedback Management Functions
// ============================================

export interface FeedbackData {
  session_id: string;
  message_id: string;
  bot_response?: string;
  feedback_type: 'like' | 'dislike';
  feedback_rating?: number;
  user_comment?: string;
  intent?: string;
  confidence?: number;
}

/**
 * Save user feedback for a chatbot response
 */
export const saveFeedback = (feedback: FeedbackData): boolean => {
  try {
    const stmt = db.prepare(`
      INSERT INTO feedback (
        session_id, 
        message_id, 
        bot_response, 
        feedback_type, 
        feedback_rating, 
        user_comment, 
        intent, 
        confidence,
        timestamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const timestamp = new Date().toISOString();
    stmt.run(
      feedback.session_id,
      feedback.message_id,
      feedback.bot_response || null,
      feedback.feedback_type,
      feedback.feedback_rating || null,
      feedback.user_comment || null,
      feedback.intent || null,
      feedback.confidence || null,
      timestamp
    );

    // Update feedback_summary table with real-time statistics
    updateFeedbackSummary(feedback.intent || 'unknown');

    return true;
  } catch (error) {
    console.error('Error saving feedback:', error);
    return false;
  }
};

/**
 * Update feedback summary statistics for an intent (called automatically when feedback is saved)
 */
const updateFeedbackSummary = (intent: string): void => {
  try {
    // Get current feedback counts for this intent
    const feedbackStats = db.prepare(`
      SELECT 
        feedback_type,
        COUNT(*) as count
      FROM feedback
      WHERE intent = ?
      GROUP BY feedback_type
    `).all(intent) as any[];

    let likeCount = 0;
    let dislikeCount = 0;

    feedbackStats.forEach((row: any) => {
      if (row.feedback_type === 'like') {
        likeCount = row.count;
      } else if (row.feedback_type === 'dislike') {
        dislikeCount = row.count;
      }
    });

    const totalCount = likeCount + dislikeCount;
    const likePercentage = totalCount > 0 ? (likeCount / totalCount) * 100 : 0;
    const dislikePercentage = totalCount > 0 ? (dislikeCount / totalCount) * 100 : 0;

    // Check if intent already exists in summary
    const existing = db.prepare('SELECT id FROM feedback_summary WHERE intent = ?').get(intent);

    if (existing) {
      // Update existing record
      db.prepare(`
        UPDATE feedback_summary
        SET 
          like_count = ?,
          dislike_count = ?,
          total_count = ?,
          like_percentage = ?,
          dislike_percentage = ?,
          last_updated = CURRENT_TIMESTAMP
        WHERE intent = ?
      `).run(
        likeCount,
        dislikeCount,
        totalCount,
        parseFloat(likePercentage.toFixed(2)),
        parseFloat(dislikePercentage.toFixed(2)),
        intent
      );
    } else {
      // Insert new record
      db.prepare(`
        INSERT INTO feedback_summary (
          intent,
          like_count,
          dislike_count,
          total_count,
          like_percentage,
          dislike_percentage
        ) VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        intent,
        likeCount,
        dislikeCount,
        totalCount,
        parseFloat(likePercentage.toFixed(2)),
        parseFloat(dislikePercentage.toFixed(2))
      );
    }
  } catch (error) {
    console.error('Error updating feedback summary:', error);
  }
};

/**
 * Get feedback summary for all intents or a specific intent
 */
export const getFeedbackSummary = (intent?: string) => {
  try {
    if (intent) {
      const stmt = db.prepare('SELECT * FROM feedback_summary WHERE intent = ?');
      return stmt.get(intent);
    } else {
      const stmt = db.prepare(`
        SELECT * FROM feedback_summary 
        ORDER BY total_count DESC, last_updated DESC
      `);
      return stmt.all();
    }
  } catch (error) {
    console.error('Error getting feedback summary:', error);
    return intent ? null : [];
  }
};

/**
 * Get overall feedback statistics across all intents
 */
export const getOverallFeedbackStats = () => {
  try {
    const stmt = db.prepare(`
      SELECT 
        SUM(like_count) as total_likes,
        SUM(dislike_count) as total_dislikes,
        SUM(total_count) as total_feedback
      FROM feedback_summary
    `);
    const result = stmt.get() as any;

    const totalLikes = result.total_likes || 0;
    const totalDislikes = result.total_dislikes || 0;
    const totalFeedback = result.total_feedback || 0;

    return {
      total_likes: totalLikes,
      total_dislikes: totalDislikes,
      total_feedback: totalFeedback,
      overall_like_percentage: totalFeedback > 0 ? parseFloat(((totalLikes / totalFeedback) * 100).toFixed(2)) : 0,
      overall_dislike_percentage: totalFeedback > 0 ? parseFloat(((totalDislikes / totalFeedback) * 100).toFixed(2)) : 0
    };
  } catch (error) {
    console.error('Error getting overall feedback stats:', error);
    return {
      total_likes: 0,
      total_dislikes: 0,
      total_feedback: 0,
      overall_like_percentage: 0,
      overall_dislike_percentage: 0
    };
  }
};


export const getFeedbackStats = (sessionId?: string) => {
  try {
    let query = 'SELECT feedback_type, COUNT(*) as count FROM feedback';
    const params: any[] = [];

    if (sessionId) {
      query += ' WHERE session_id = ?';
      params.push(sessionId);
    }

    query += ' GROUP BY feedback_type';

    const stmt = db.prepare(query);
    const results = stmt.all(...params) as any[];

    const stats = {
      likes: 0,
      dislikes: 0,
      total: 0
    };

    results.forEach((row: any) => {
      if (row.feedback_type === 'like') {
        stats.likes = row.count;
      } else if (row.feedback_type === 'dislike') {
        stats.dislikes = row.count;
      }
      stats.total += row.count;
    });

    return stats;
  } catch (error) {
    console.error('Error getting feedback stats:', error);
    return { likes: 0, dislikes: 0, total: 0 };
  }
};

/**
 * Get all feedback for a session
 */
export const getSessionFeedback = (sessionId: string) => {
  try {
    const stmt = db.prepare(`
      SELECT * FROM feedback 
      WHERE session_id = ? 
      ORDER BY created_at DESC
    `);
    return stmt.all(sessionId);
  } catch (error) {
    console.error('Error getting session feedback:', error);
    return [];
  }
};

/**
 * Get feedback for a specific message
 */
export const getMessageFeedback = (messageId: string) => {
  try {
    const stmt = db.prepare(`
      SELECT * FROM feedback 
      WHERE message_id = ?
    `);
    return stmt.get(messageId);
  } catch (error) {
    console.error('Error getting message feedback:', error);
    return null;
  }
};

// Save order to database
export const saveOrder = (orderData: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  productName: string;
  quantity: number;
  paymentMethod: string;
  deliveryMethod: string;
}): { orderId: string; success: boolean } => {
  try {
    // Generate professional order ID: ORD-YYYYMMDD-XXXXX (where XXXXX is random)
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomNum = String(Math.floor(Math.random() * 100000)).padStart(5, '0');
    const orderId = `ORD-${dateStr}-${randomNum}`;

    // Generate tracking number
    const trackingNumber = `TRK-${dateStr}-${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`;

    // Calculate estimated delivery based on delivery method
    const deliveryDate = new Date(now);
    if (orderData.deliveryMethod.includes('Standard')) {
      deliveryDate.setDate(deliveryDate.getDate() + 6); // 5-7 days
    } else if (orderData.deliveryMethod.includes('Express')) {
      deliveryDate.setDate(deliveryDate.getDate() + 2); // 2-3 days
    } else if (orderData.deliveryMethod.includes('Overnight')) {
      deliveryDate.setDate(deliveryDate.getDate() + 1); // 1 day
    }
    const estimatedDelivery = deliveryDate.toISOString().slice(0, 10);

    // Calculate total amount (using default pricing)
    let totalAmount = 5000; // Base product price
    if (orderData.deliveryMethod.includes('Standard')) {
      totalAmount += 200;
    } else if (orderData.deliveryMethod.includes('Express')) {
      totalAmount += 500;
    } else if (orderData.deliveryMethod.includes('Overnight')) {
      totalAmount += 1000;
    }
    totalAmount *= orderData.quantity;

    const stmt = db.prepare(`
      INSERT INTO orders (
        orderId,
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
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      orderId,
      orderData.customerName,
      orderData.customerEmail,
      orderData.customerPhone,
      'Processing',
      now.toISOString(),
      totalAmount,
      orderData.paymentMethod,
      orderData.shippingAddress,
      trackingNumber,
      estimatedDelivery,
      JSON.stringify([{
        name: orderData.productName,
        quantity: orderData.quantity,
        price: 5000,
        category: 'Product'
      }])
    );

    console.log(`Order saved: ${orderId}`);
    return { orderId, success: true };
  } catch (error) {
    console.error('Error saving order:', error);
    return { orderId: '', success: false };
  }
};

// Initialize database on module load
initDatabase();

export default db;