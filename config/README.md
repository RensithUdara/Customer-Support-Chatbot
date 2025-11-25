# Dialogflow Service Account Configuration

## Setup Instructions:

1. **Create Google Cloud Project:**
   - Go to: https://console.cloud.google.com/
   - Create new project: `customer-support-chatbot`
   - Enable Dialogflow API

2. **Create Service Account:**
   - Go to IAM & Admin > Service Accounts
   - Create service account: `dialogflow-service`
   - Grant role: `Dialogflow API Client`
   - Download JSON key file
   - Save as: `dialogflow-service-account.json` in this directory

3. **Create Dialogflow Agent:**
   - Go to: https://dialogflow.cloud.google.com/
   - Create new agent
   - Link to your Google Cloud project
   - Note the project ID for .env.local

## Security Note:
The service account JSON file should NOT be committed to Git.
Add it to .gitignore for security.