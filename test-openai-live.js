// Test OpenAI Service with REAL API key
// Run with: node test-openai-live.js

// Import fetch for Node.js
const fetch = require('node-fetch');
global.fetch = fetch;

// OpenAI Service implementation
class OpenAIService {
  constructor(config) {
    this.apiKey = config.apiKey;
    this.model = config.model || 'gpt-3.5-turbo';
    this.temperature = config.temperature || 0.7;
    this.maxTokens = config.maxTokens || 1000;
  }

  async sendToLLM(prompt) {
    if (!this.apiKey) {
      return {
        content: '',
        error: 'OpenAI API key not configured'
      };
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: this.temperature,
          max_tokens: this.maxTokens
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`OpenAI API error: ${response.status} - ${error}`);
      }

      const data = await response.json();
      
      if (data.choices && data.choices.length > 0) {
        return {
          content: data.choices[0].message.content
        };
      } else {
        throw new Error('No response from OpenAI');
      }
    } catch (error) {
      console.error('OpenAI API error:', error);
      return {
        content: '',
        error: error.message
      };
    }
  }
}

// Test with real API key
async function testRealAPI() {
  console.log('=== Testing OpenAI with REAL API Key ===\n');

  const service = new OpenAIService({
    apiKey: process.env.OPENAI_API_KEY || 'your-api-key-here', // Set via environment variable
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 200
  });

  // Test 1: Emergency treaty assistance
  console.log('Test 1: Emergency Treaty Creation');
  const prompt1 = 'Help me create a brief emergency contact treaty for someone with diabetes. Keep it under 100 words.';
  console.log('Prompt:', prompt1);
  
  const result1 = await service.sendToLLM(prompt1);
  if (result1.error) {
    console.log('❌ Error:', result1.error);
  } else {
    console.log('✅ Response:', result1.content);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');

  // Test 2: Treaty improvement
  console.log('Test 2: Treaty Enhancement');
  const prompt2 = 'Improve this treaty: "Call 911 if emergency"';
  console.log('Prompt:', prompt2);
  
  const result2 = await service.sendToLLM(prompt2);
  if (result2.error) {
    console.log('❌ Error:', result2.error);
  } else {
    console.log('✅ Response:', result2.content);
  }

  console.log('\n✅ Live API testing complete!');
}

// Run the test
testRealAPI().catch(console.error);
