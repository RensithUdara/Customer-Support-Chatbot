#!/usr/bin/env node
/**
 * Automated Dialogflow Agent Setup Script
 * This script automatically creates intents and entities in Dialogflow
 */

const { IntentsClient, EntityTypesClient } = require('@google-cloud/dialogflow');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Read from environment variables
const projectId = process.env.DIALOGFLOW_PROJECT_ID;
const keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!projectId || !keyFilename) {
    console.error('❌ Missing environment variables. Make sure DIALOGFLOW_PROJECT_ID and GOOGLE_APPLICATION_CREDENTIALS are set.');
    process.exit(1);
}

console.log(`🚀 Setting up Dialogflow Agent: ${projectId}`);
console.log(`🔑 Using credentials: ${keyFilename}`);

// Initialize clients
const intentsClient = new IntentsClient({ keyFilename });
const entityTypesClient = new EntityTypesClient({ keyFilename });

// Project path
const projectPath = intentsClient.projectAgentPath(projectId);

// Entity Types to Create
const ENTITY_TYPES = [
    {
        displayName: 'order-id',
        kind: 'KIND_MAP',
        entities: [
            { value: 'ORD001', synonyms: ['ORD001', 'order 001', 'order number 001', '001'] },
            { value: 'ORD123', synonyms: ['ORD123', 'order 123', 'order number 123', '123'] },
            { value: 'ORD456', synonyms: ['ORD456', 'order 456', 'order number 456', '456'] },
            { value: 'ORD789', synonyms: ['ORD789', 'order 789', 'order number 789', '789'] },
            { value: 'ORD999', synonyms: ['ORD999', 'order 999', 'order number 999', '999'] }
        ]
    },
    {
        displayName: 'support-type',
        kind: 'KIND_MAP',
        entities: [
            { value: 'whatsapp', synonyms: ['whatsapp', 'whats app', 'wa', 'whatsapp support'] },
            { value: 'phone', synonyms: ['phone', 'call', 'telephone', 'phone support'] },
            { value: 'email', synonyms: ['email', 'mail', 'e-mail', 'email support'] },
            { value: 'chat', synonyms: ['chat', 'live chat', 'online chat', 'website chat'] },
            { value: 'technical', synonyms: ['technical', 'tech', 'it', 'technical support'] },
            { value: 'returns', synonyms: ['returns', 'return', 'refund', 'returns support'] }
        ]
    },
    {
        displayName: 'product-category',
        kind: 'KIND_MAP',
        entities: [
            { value: 'mobile', synonyms: ['mobile', 'phone', 'smartphone', 'cell phone'] },
            { value: 'laptop', synonyms: ['laptop', 'notebook', 'computer'] },
            { value: 'headphone', synonyms: ['headphone', 'headphones', 'earphones', 'headset'] },
            { value: 'tablet', synonyms: ['tablet', 'tab', 'ipad'] },
            { value: 'watch', synonyms: ['watch', 'smartwatch', 'wearable'] }
        ]
    }
];

// Intents to Create
const INTENTS = [
    {
        displayName: 'order.status',
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
            'Check order ORD999',
            'My order status',
            'Track order'
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

    {
        displayName: 'support.whatsapp',
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
            'WhatsApp support details',
            'WhatsApp customer care',
            'Contact through WhatsApp'
        ]
    },

    {
        displayName: 'support.phone',
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
            'Phone customer service',
            'Customer care number',
            'Support phone number'
        ]
    },

    {
        displayName: 'support.email',
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
            'Contact support email',
            'Email customer care',
            'Support email address'
        ]
    },

    {
        displayName: 'support.chat',
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
            'Chat help',
            'Live support',
            'Chat customer service'
        ]
    },

    {
        displayName: 'support.technical',
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
            'Technology support',
            'Technical issues',
            'Tech problems'
        ]
    },

    {
        displayName: 'support.returns',
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
            'Return policy help',
            'How to return',
            'Refund process'
        ]
    },

    {
        displayName: 'delivery.methods',
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
            'Delivery choices',
            'Shipping choices',
            'Delivery ways'
        ]
    },

    {
        displayName: 'return.policies',
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
            'Return and refund policy',
            'Return guidelines',
            'Refund rules'
        ]
    },

    {
        displayName: 'payment.methods',
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
            'How to make payment?',
            'Payment ways',
            'Payment options available'
        ]
    },

    {
        displayName: 'product.recommend',
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
            'Professional laptop recommendations',
            'Best budget phones',
            'Recommend gaming laptop'
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
    },

    {
        displayName: 'data.query',
        trainingPhrases: [
            'Show me shipping zones',
            'Current promotions',
            'What promotions are available?',
            'Show warranty policies',
            'Customer support information',
            'All payment methods',
            'Show all delivery options',
            'What support topics available?',
            'Display shipping areas',
            'Current offers',
            'Active promotions',
            'Support information'
        ]
    }
];

// Create Entity Types
async function createEntityTypes() {
    console.log('\n📋 Creating entity types...');

    for (const entityType of ENTITY_TYPES) {
        try {
            const [response] = await entityTypesClient.createEntityType({
                parent: projectPath,
                entityType: entityType
            });
            console.log(`✅ Created entity type: ${entityType.displayName}`);
        } catch (error) {
            if (error.code === 6) { // ALREADY_EXISTS
                console.log(`⚠️  Entity type already exists: ${entityType.displayName}`);
            } else {
                console.error(`❌ Error creating entity type ${entityType.displayName}:`, error.message);
            }
        }
    }
}

// Create Intents  
async function createIntents() {
    console.log('\n🎯 Creating intents...');

    for (const intent of INTENTS) {
        try {
            // Format training phrases
            const trainingPhrases = intent.trainingPhrases.map(phrase => ({
                parts: [{ text: phrase }],
                type: 'EXAMPLE'
            }));

            // Format parameters if any
            const parameters = intent.parameters ? intent.parameters.map(param => ({
                displayName: param.displayName,
                entityTypeDisplayName: param.entityTypeDisplayName,
                isList: param.isList || false,
                mandatory: param.mandatory || false
            })) : [];

            const intentRequest = {
                displayName: intent.displayName,
                trainingPhrases: trainingPhrases,
                parameters: parameters
            };

            const [response] = await intentsClient.createIntent({
                parent: projectPath,
                intent: intentRequest
            });

            console.log(`✅ Created intent: ${intent.displayName} (${intent.trainingPhrases.length} phrases)`);
        } catch (error) {
            if (error.code === 6) { // ALREADY_EXISTS
                console.log(`⚠️  Intent already exists: ${intent.displayName}`);
            } else {
                console.error(`❌ Error creating intent ${intent.displayName}:`, error.message);
            }
        }
    }
}

// Main setup function
async function setupAgent() {
    try {
        console.log('\n🤖 Starting automated Dialogflow setup...');

        await createEntityTypes();
        await createIntents();

        console.log('\n🎉 Dialogflow agent setup completed!');
        console.log('\n📖 Next steps:');
        console.log('1. Go to https://dialogflow.cloud.google.com/');
        console.log('2. Open your agent to verify intents and entities');
        console.log('3. Test your agent in the simulator');
        console.log('4. Start your Next.js server: npm run dev');

    } catch (error) {
        console.error('\n❌ Setup failed:', error);
    }
}

// Run the setup
setupAgent();