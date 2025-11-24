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
      category TEXT NOT NULL,
      question_example TEXT NOT NULL,
      answer_text TEXT NOT NULL
    )
  `);

    // Create products table
    db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      brand TEXT,
      price REAL NOT NULL,
      description TEXT NOT NULL,
      tags TEXT
    )
  `);

    // Create orders table
    db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY,
      customer_name TEXT NOT NULL,
      product_id INTEGER NOT NULL,
      order_date TEXT NOT NULL,
      delivery_date TEXT,
      status TEXT NOT NULL,
      FOREIGN KEY (product_id) REFERENCES products (id)
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
};

// Database helper functions
export const getFAQs = () => {
    return db.prepare('SELECT * FROM faqs').all();
};

export const searchFAQs = (keywords: string[]) => {
    const query = keywords.map(k => `question_example LIKE '%${k}%' OR answer_text LIKE '%${k}%' OR category LIKE '%${k}%'`).join(' OR ');
    return db.prepare(`SELECT * FROM faqs WHERE ${query} LIMIT 3`).all();
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
        query += ' AND tags LIKE ?';
        params.push(`%${tags}%`);
    }

    query += ' LIMIT 5';

    return db.prepare(query).all(...params);
};

export const getOrderById = (orderId: number) => {
    const query = `
    SELECT o.*, p.name as product_name, p.brand, p.price 
    FROM orders o 
    JOIN products p ON o.product_id = p.id 
    WHERE o.id = ?
  `;
    return db.prepare(query).get(orderId);
};

export const saveConversation = (sessionId: string, message: string, sender: 'user' | 'bot', intent?: string) => {
    const stmt = db.prepare(`
    INSERT INTO conversations (session_id, message, sender, timestamp, intent)
    VALUES (?, ?, ?, ?, ?)
  `);
    return stmt.run(sessionId, message, sender, new Date().toISOString(), intent);
};

// Initialize database on module load
initDatabase();

export default db;