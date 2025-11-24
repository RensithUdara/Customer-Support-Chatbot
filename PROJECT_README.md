# Customer Support Chatbot - AI Subject Mini Project

An intelligent e-commerce customer support chatbot built with Next.js, TypeScript, SQLite, and AI integration. This project demonstrates advanced AI-powered natural language processing for customer service automation.

## 🎯 Project Overview

This chatbot handles three main categories of customer queries:
- **Order Status Tracking** - Real-time order status updates using order numbers
- **Policy & FAQ Support** - Automated responses for return policies, shipping, payments, and warranty
- **Product Recommendations** - AI-powered product suggestions based on budget and preferences

## 🏗️ System Architecture

```
Frontend (Next.js + React) 
    ↓
API Routes (/api/chat)
    ↓
Intent Detection & Context Extraction
    ↓
Database Queries (SQLite) + LLM Processing
    ↓
Structured Response Generation
    ↓
JSON Response to Frontend
```

## 📁 Project Structure

```
customer-support-chatbot/
├── app/
│   ├── api/chat/route.ts          # Main chatbot API endpoint
│   ├── chat/page.tsx              # Chat interface page
│   ├── page.tsx                   # Landing page
│   └── layout.tsx
├── components/
│   └── ChatWindow.tsx             # Main chat component
├── lib/
│   ├── db.ts                      # SQLite database operations
│   ├── intent.ts                  # Intent detection logic
│   └── llm.ts                     # LLM integration wrapper
├── data/
│   ├── seedData.ts                # Initial dataset
│   ├── seed.ts                    # Database seeding script
│   └── ecommerce.db              # SQLite database file
└── README.md
```

## 🗄️ Database Schema

### Tables
- **faqs** - Frequently asked questions and policies
- **products** - Product catalog with descriptions and pricing
- **orders** - Customer order information and status
- **conversations** - Chat history and analytics

## 🚀 Getting Started

### Prerequisites
- Node.js 18.0 or later
- npm or yarn

### Installation

1. **Clone and Install**
```bash
git clone <your-repo-url>
cd customer-support-chatbot
npm install
```

2. **Seed the Database**
```bash
npm run seed
```

3. **Start Development Server**
```bash
npm run dev
```

4. **Open Your Browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🤖 AI Implementation Details

### Intent Detection
- **Rule-based Layer**: Keywords and pattern matching for quick classification
- **Extraction Logic**: Automatically extracts order IDs, budgets, categories, and tags
- **Confidence Scoring**: Provides confidence levels for intent predictions

### LLM Integration
- **Controlled Responses**: Uses database context to prevent hallucinations
- **Structured Prompts**: System prompts tailored for each intent type
- **Response Formatting**: Consistent, polite, and informative responses

### Context Management
- **FAQ Retrieval**: Semantic search through policy documents
- **Product Filtering**: Budget, category, and feature-based filtering
- **Order Lookup**: Real-time status updates from order database

## 📊 Sample Interactions

### Order Tracking
**User:** "Where is my order 1012?"  
**Bot:** "Your order #1012 for Xiaomi Redmi Note 12 Pro is currently shipped. It was shipped on 2024-11-20 and is expected to be delivered by 2024-11-25."

### Policy Questions
**User:** "What is your return policy?"  
**Bot:** "We offer a 15-day return policy from the date of delivery. Items must be in original condition with tags intact. Electronics have a 7-day return window."

### Product Recommendations
**User:** "Recommend a phone under 25000"  
**Bot:** "Based on your requirements, here are my top recommendations:
1. **OnePlus Nord CE 3** - ₹26,999
2. **Xiaomi Redmi Note 12 Pro** - ₹23,999
3. **POCO X5 Pro** - ₹22,999"

## 🛠️ Technical Features

- **Next.js 16** with App Router
- **TypeScript** for type safety
- **SQLite** with better-sqlite3 for fast local database
- **Tailwind CSS** for modern responsive UI
- **Intent Classification** with confidence scoring
- **Real-time Chat Interface** with typing indicators
- **Session Management** for conversation continuity
- **Error Handling** with graceful fallbacks

## 📈 Performance Considerations

- **Database Indexing**: Optimized queries for fast response times
- **Caching Strategy**: Efficient caching of frequent queries
- **Response Streaming**: Real-time message delivery
- **Error Recovery**: Robust error handling and fallback responses

## 🎓 Academic Significance

### AI Components Demonstrated
1. **Natural Language Understanding** - Intent classification and entity extraction
2. **Information Retrieval** - Context-aware database querying
3. **Response Generation** - Template-based and AI-generated responses
4. **Conversation Management** - Session handling and context preservation

### Learning Outcomes
- Understanding of production-grade chatbot architecture
- Implementation of hybrid AI systems (rule-based + ML)
- Database design for conversational AI applications
- User experience design for chat interfaces

## 🔧 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run seed         # Seed database with initial data
npm run lint         # Run ESLint
```

## 🎯 Future Enhancements

- **Multi-language Support** - Internationalization for global users
- **Voice Interface** - Speech-to-text and text-to-speech capabilities
- **Advanced Analytics** - User behavior and conversation analytics
- **Admin Dashboard** - Real-time monitoring and configuration
- **Webhook Integration** - Real-time order status updates
- **Sentiment Analysis** - Emotion detection and appropriate responses

## 📝 Project Report Sections

1. **Problem Statement** - E-commerce customer support automation
2. **System Design** - Architecture diagrams and data flow
3. **AI Implementation** - Intent detection and response generation
4. **Database Design** - Schema and data relationships
5. **User Interface** - Chat experience and interaction design
6. **Testing & Validation** - Test cases and performance metrics
7. **Results & Analysis** - Accuracy metrics and user feedback
8. **Conclusions** - Lessons learned and future improvements

## 👥 Contributors

- Your Name - AI Subject Mini Project
- Course: [Your Course Name]
- Institution: [Your Institution]
- Academic Year: [Year]

---

**Built with ❤️ for AI Education**