# API Testing Guide

## Chat API Endpoint

**URL**: `POST /api/chat`  
**Content-Type**: `application/json`

### Request Format
```json
{
  "message": "Your query here",
  "sessionId": "optional_session_id"
}
```

### Response Format
```json
{
  "reply": "Bot's response",
  "intent": "ORDER_STATUS | POLICY | PRODUCT_RECOMMENDATION | OTHER",
  "confidence": 0.85,
  "sessionId": "session_123"
}
```

## Test Cases

### 1. Order Status Queries
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Where is my order 1012?"}'
```

Expected: Order details with status, product name, and delivery dates.

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Track order 1005"}'
```

### 2. Policy & FAQ Queries
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is your return policy?"}'
```

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Do you offer cash on delivery?"}'
```

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What are your delivery charges?"}'
```

### 3. Product Recommendation Queries
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Recommend a phone under 25000"}'
```

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Best laptop for gaming under 60000"}'
```

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Suggest budget headphones"}'
```

### 4. General/Fallback Queries
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, how are you?"}'
```

## Database Queries

### Check Database Contents
You can inspect the SQLite database using any SQLite browser or command line:

```sql
-- View all FAQs
SELECT * FROM faqs;

-- View all products
SELECT * FROM products;

-- View all orders with product details
SELECT o.*, p.name as product_name 
FROM orders o 
JOIN products p ON o.product_id = p.id;

-- View conversation history
SELECT * FROM conversations ORDER BY timestamp DESC LIMIT 10;
```

## Testing with Different Scenarios

### Valid Order IDs to Test:
- 1001 - Samsung Galaxy A14 5G (Processing)
- 1002 - HP Pavilion 15 (Shipped)
- 1003 - iPhone 15 (Delivered)
- 1012 - Xiaomi Redmi Note 12 Pro (Shipped)

### Product Categories to Test:
- "mobile" or "phone"
- "laptop"
- "headphones"
- "watch"

### Budget Ranges to Test:
- Under 20000
- Under 30000
- Under 50000
- Under 100000

### Policy Keywords to Test:
- "return policy"
- "refund"
- "warranty"
- "delivery charges"
- "cash on delivery"
- "payment methods"

## Expected Response Times
- Order Status: ~1-3 seconds
- Policy Questions: ~1-2 seconds
- Product Recommendations: ~2-4 seconds
- General Queries: ~1-2 seconds

## Error Handling Test Cases

### Invalid Order ID
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Where is order 9999?"}'
```

### Empty Message
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": ""}'
```

### Malformed Request
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"invalid": "json"}'
```