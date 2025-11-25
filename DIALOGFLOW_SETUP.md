# Dialogflow Integration Setup Guide

## 📋 **Complete Setup Instructions**

### **Phase 1: Google Cloud Setup (5 minutes)**

1. **Create Google Cloud Project:**
   ```
   - Go to: https://console.cloud.google.com/
   - Click "New Project"
   - Name: "customer-support-chatbot"
   - Note the Project ID (e.g., customer-support-chatbot-441617)
   ```

2. **Enable Dialogflow API:**
   ```
   - In Google Cloud Console, go to APIs & Services > Library
   - Search "Dialogflow API"
   - Click "Enable"
   ```

3. **Create Service Account:**
   ```
   - Go to IAM & Admin > Service Accounts
   - Click "Create Service Account"
   - Name: "dialogflow-service"
   - Role: "Dialogflow API Client"
   - Create and download JSON key
   - Save as: config/dialogflow-service-account.json
   ```

### **Phase 2: Dialogflow Agent Setup (10 minutes)**

1. **Create Dialogflow Agent:**
   ```
   - Go to: https://dialogflow.cloud.google.com/
   - Click "Create Agent"
   - Name: "Customer Support Bot"
   - Link to your Google Cloud project
   - Language: English
   ```

2. **Update Environment Variables:**
   ```
   Update .env.local with your project ID:
   DIALOGFLOW_PROJECT_ID=your-actual-project-id
   ```

### **Phase 3: Intent Creation (15 minutes)**

**Create these intents in Dialogflow Console:**

#### **1. order.status**
```
Training Phrases:
- What is the status of my order ORD123?
- Track my order ORD456
- Where is my order?
- Order status for ORD789

Parameters:
- order-id (Entity: @order-id)
```

#### **2. support.whatsapp**
```
Training Phrases:
- WhatsApp support
- WhatsApp contact
- Contact via WhatsApp
- I need WhatsApp support
```

#### **3. support.phone**
```
Training Phrases:
- Phone support
- Phone contact
- Call customer service
- Phone number
```

#### **4. support.email**
```
Training Phrases:
- Email support
- Email contact
- Support email address
- Contact by email
```

#### **5. delivery.methods**
```
Training Phrases:
- What delivery methods do you have?
- Delivery options
- Shipping methods
- How do you deliver?
```

#### **6. return.policies**
```
Training Phrases:
- What is your return policy?
- Return policy
- Can I return items?
- Return process
```

#### **7. payment.methods**
```
Training Phrases:
- What payment methods do you accept?
- Payment options
- How can I pay?
- Payment types
```

### **Phase 4: Entity Creation (10 minutes)**

**Create these entities in Dialogflow:**

#### **@order-id**
```
Entities:
- ORD001 (synonyms: ORD001, order 001)
- ORD123 (synonyms: ORD123, order 123)
- ORD456 (synonyms: ORD456, order 456)
```

#### **@product-category**
```
Entities:
- mobile (synonyms: mobile, phone, smartphone)
- laptop (synonyms: laptop, notebook, computer)
- headphone (synonyms: headphone, headphones, earphones)
```

#### **@support-type**
```
Entities:
- whatsapp (synonyms: whatsapp, whats app, wa)
- phone (synonyms: phone, call, telephone)
- email (synonyms: email, mail, e-mail)
```

### **Phase 5: Testing & Validation**

1. **Test Dialogflow Setup:**
   ```bash
   npm run setup-dialogflow
   ```

2. **Test Connection:**
   ```bash
   npm run test-dialogflow
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```

4. **Test Queries:**
   ```
   - "WhatsApp support" → Should detect support.whatsapp
   - "Order status ORD123" → Should detect order.status with ORD123
   - "What payment methods?" → Should detect payment.methods
   ```

## 🔧 **Troubleshooting**

### **Common Issues:**

1. **"Dialogflow not configured" error:**
   ```
   - Check .env.local file exists and has correct PROJECT_ID
   - Verify service account JSON file is in config/ folder
   - Ensure Google Cloud APIs are enabled
   ```

2. **Low confidence scores:**
   ```
   - Add more training phrases to intents
   - Use more varied language in training
   - Adjust confidence threshold in code (currently 0.6)
   ```

3. **Entities not extracted:**
   ```
   - Verify entity types are created in Dialogflow
   - Check parameter mapping in intents
   - Test with exact entity values first
   ```

## 📊 **Monitoring & Analytics**

**View Dialogflow Analytics:**
- Go to Dialogflow Console > Analytics
- Monitor intent detection rates
- Review unmatched queries
- Optimize training phrases

**Application Logs:**
- Check console for "Intent detected" messages
- Look for "Dialogflow intent" vs "fallback intent" usage
- Monitor confidence scores

## 🚀 **Advanced Features (Future)**

1. **Small Talk Intents:**
   - Add greetings, thank you, goodbye intents
   - Improve user experience with casual conversation

2. **Multi-language Support:**
   - Add Sinhala/Tamil language support
   - Create separate agents per language

3. **Rich Responses:**
   - Add cards, quick replies, images
   - Enhance mobile user experience

4. **Voice Integration:**
   - Enable Google Assistant integration
   - Add voice commands support

## ✅ **Success Criteria**

Your hybrid system is working correctly when:
- [ ] Intent detection confidence > 0.6 for most queries
- [ ] Fallback system activates when Dialogflow is unavailable
- [ ] Specific support queries (WhatsApp, phone, email) work correctly
- [ ] Order status queries extract order IDs properly
- [ ] Console logs show both Dialogflow and fallback usage

## 🎯 **Expected Improvements**

**Before (Rule-based):**
- Intent accuracy: ~70%
- Limited entity extraction
- Exact keyword matching only

**After (Hybrid with Dialogflow):**
- Intent accuracy: ~90%+
- Advanced entity extraction
- Natural language understanding
- Fallback reliability