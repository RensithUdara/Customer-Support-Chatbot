#!/usr/bin/env node
/**
 * Dialogflow Setup Script for Customer Support Chatbot
 * This script helps set up intents and entities in Dialogflow
 */

import { IntentsClient } from '@google-cloud/dialogflow';
import * as path from 'path';
import * as fs from 'fs';

const projectId = process.env.DIALOGFLOW_PROJECT_ID || 'customer-support-chatbot-441617';

// Training phrases for different intents
const TRAINING_DATA = {
  'order.status': {
    trainingPhrases: [
      'What is the status of my order ORD123?',
      'Track my order ORD456',
      'Where is my order?',
      'Order status for ORD789',
      'Can you check my order ORD001?',
      'I want to track order ORD555',
      'What happened to my order?',
      'When will my order arrive?',
      'Order delivery status',
      'Check order ORD999'
    ],
    parameters: [
      {
        displayName: 'order-id',
        entityTypeDisplayName: '@order-id',
        isList: false,
        mandatory: false
      }
    ]
  },

  'support.whatsapp': {
    trainingPhrases: [
      'WhatsApp support',
      'WhatsApp contact',
      'Contact via WhatsApp',
      'WhatsApp customer service',
      'WhatsApp help',
      'I need WhatsApp support',
      'WhatsApp number',
      'WhatsApp support contact',
      'How to contact via WhatsApp',
      'WhatsApp support details'
    ]
  },

  'support.phone': {
    trainingPhrases: [
      'Phone support',
      'Phone contact',
      'Call customer service',
      'Phone number',
      'Contact by phone',
      'Phone support number',
      'I need phone support',
      'Call support',
      'Telephone support',
      'Phone customer service'
    ]
  },

  'support.email': {
    trainingPhrases: [
      'Email support',
      'Email contact',
      'Support email address',
      'Contact by email',
      'Email customer service',
      'I need email support',
      'Support email',
      'Customer service email',
      'Email help',
      'Contact support email'
    ]
  },

  'support.chat': {
    trainingPhrases: [
      'Live chat support',
      'Chat support',
      'Online chat',
      'Live chat',
      'Chat with support',
      'Website chat',
      'I need chat support',
      'Live customer support',
      'Online support chat',
      'Chat help'
    ]
  },

  'support.technical': {
    trainingPhrases: [
      'Technical support',
      'Tech support',
      'Technical help',
      'I have a technical issue',
      'Technical problem',
      'Tech help',
      'Technical assistance',
      'IT support',
      'Technical customer service',
      'Technology support'
    ]
  },

  'support.returns': {
    trainingPhrases: [
      'Returns support',
      'Return help',
      'Refund support',
      'I want to return',
      'Return process help',
      'Returns customer service',
      'Return assistance',
      'Refund help',
      'Returns department',
      'Return policy help'
    ]
  },

  'delivery.methods': {
    trainingPhrases: [
      'What delivery methods do you have?',
      'Delivery options',
      'Shipping methods',
      'How do you deliver?',
      'Available delivery options',
      'Shipping options',
      'Delivery types',
      'How can I get my order?',
      'What shipping methods available?',
      'Delivery choices'
    ]
  },

  'return.policies': {
    trainingPhrases: [
      'What is your return policy?',
      'Return policy',
      'Can I return items?',
      'Return process',
      'Refund policy',
      'How to return products?',
      'Return conditions',
      'Return rules',
      'Exchange policy',
      'Return and refund policy'
    ]
  },

  'payment.methods': {
    trainingPhrases: [
      'What payment methods do you accept?',
      'Payment options',
      'How can I pay?',
      'Payment types',
      'Available payment methods',
      'Payment choices',
      'What ways to pay?',
      'Payment information',
      'Accepted payment methods',
      'How to make payment?'
    ]
  },

  'product.recommend': {
    trainingPhrases: [
      'Recommend a phone under 50000',
      'Best laptop for students',
      'Suggest headphones under 5000',
      'Good mobile phone under 30000',
      'Budget laptop recommendations',
      'Best phone for gaming',
      'Recommend office laptop',
      'Suggest budget headphones',
      'Good smartphone under budget',
      'Professional laptop recommendations'
    ],
    parameters: [
      {
        displayName: 'product-category',
        entityTypeDisplayName: '@product-category',
        isList: false,
        mandatory: false
      },
      {
        displayName: 'budget',
        entityTypeDisplayName: '@sys.number',
        isList: false,
        mandatory: false
      }
    ]
  }
};

// Entity types to create
const ENTITIES = {
  'order-id': {
    entries: [
      { value: 'ORD001', synonyms: ['ORD001', 'order 001', 'order number 001'] },
      { value: 'ORD123', synonyms: ['ORD123', 'order 123', 'order number 123'] },
      { value: 'ORD456', synonyms: ['ORD456', 'order 456', 'order number 456'] },
      { value: 'ORD789', synonyms: ['ORD789', 'order 789', 'order number 789'] }
    ]
  },
  
  'product-category': {
    entries: [
      { value: 'mobile', synonyms: ['mobile', 'phone', 'smartphone', 'cell phone'] },
      { value: 'laptop', synonyms: ['laptop', 'notebook', 'computer'] },
      { value: 'headphone', synonyms: ['headphone', 'headphones', 'earphones', 'headset'] },
      { value: 'tablet', synonyms: ['tablet', 'tab', 'ipad'] },
      { value: 'watch', synonyms: ['watch', 'smartwatch', 'wearable'] }
    ]
  },
  
  'support-type': {
    entries: [
      { value: 'whatsapp', synonyms: ['whatsapp', 'whats app', 'wa'] },
      { value: 'phone', synonyms: ['phone', 'call', 'telephone'] },
      { value: 'email', synonyms: ['email', 'mail', 'e-mail'] },
      { value: 'chat', synonyms: ['chat', 'live chat', 'online chat'] },
      { value: 'technical', synonyms: ['technical', 'tech', 'it'] },
      { value: 'returns', synonyms: ['returns', 'return', 'refund'] }
    ]
  }
};

async function setupDialogflow() {
  console.log('🚀 Setting up Dialogflow intents and entities...');
  
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.error('❌ GOOGLE_APPLICATION_CREDENTIALS environment variable is not set');
    console.log('📝 Please set up your service account JSON file and update .env.local');
    return;
  }

  try {
    console.log(`📋 Training data prepared for ${Object.keys(TRAINING_DATA).length} intents`);
    console.log(`🏷️ Entity data prepared for ${Object.keys(ENTITIES).length} entity types`);
    
    console.log('\n✅ Dialogflow setup data is ready!');
    console.log('\n📖 Next steps:');
    console.log('1. Create a Dialogflow ES agent in Google Cloud Console');
    console.log('2. Import these intents manually or use the Dialogflow Console');
    console.log('3. Train and test your agent');
    console.log('4. Update your environment variables');
    
    // Save training data to file for manual import
    const setupData = {
      projectId,
      intents: TRAINING_DATA,
      entities: ENTITIES,
      instructions: {
        step1: 'Go to https://dialogflow.cloud.google.com/',
        step2: 'Create new agent and link to your Google Cloud project',
        step3: 'Create intents using the training phrases above',
        step4: 'Create entity types using the entity data above',
        step5: 'Test your agent and adjust confidence thresholds'
      }
    };
    
    fs.writeFileSync(
      path.join(process.cwd(), 'config', 'dialogflow-setup.json'),
      JSON.stringify(setupData, null, 2)
    );
    
    console.log('\n💾 Setup data saved to config/dialogflow-setup.json');
    
  } catch (error) {
    console.error('❌ Setup error:', error);
  }
}

// Run setup
setupDialogflow();