const Database = require('better-sqlite3');
const path = require('path');

// Connect to the database
const db = new Database(path.join(__dirname, 'data', 'ecommerce.db'));

console.log('🔍 Checking existing database structure...\n');

// Function to get table info
function getTableInfo(tableName) {
    try {
        const pragma = db.prepare(`PRAGMA table_info(${tableName})`).all();
        return pragma;
    } catch (e) {
        return null;
    }
}

// Check existing tables
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();

console.log('📊 Existing Tables:');
tables.forEach(table => {
    console.log(`\n🗂️  Table: ${table.name}`);
    const columns = getTableInfo(table.name);
    if (columns) {
        columns.forEach(col => {
            console.log(`   - ${col.name} (${col.type})`);
        });

        // Get row count
        try {
            const count = db.prepare(`SELECT COUNT(*) as count FROM ${table.name}`).get();
            console.log(`   📊 Records: ${count.count}`);
        } catch (e) {
            console.log(`   📊 Records: Error counting`);
        }
    }
});

db.close();