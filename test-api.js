const response = await fetch('http://localhost:3001/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: 'What is your return policy?',
    sessionId: 'test123'
  })
});

const data = await response.json();
console.log('API Response:', JSON.stringify(data, null, 2));