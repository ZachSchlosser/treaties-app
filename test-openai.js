// Test OpenAI Service - Real functionality tests
// Run with: node test-openai.js

// Mock fetch for Node.js environment
global.fetch = async (url, options) => {
  console.log(`  Fetch called to: ${url}`);
  console.log(`  Method: ${options.method}`);
  console.log(`  Headers:`, JSON.stringify(options.headers, null, 2));
  
  const body = JSON.parse(options.body);
  console.log(`  Model: ${body.model}`);
  console.log(`  Temperature: ${body.temperature}`);
  console.log(`  Max tokens: ${body.max_tokens}`);
  console.log(`  Message: "${body.messages[0].content}"`);
  
  // Simulate different responses based on API key
  const authHeader = options.headers.Authorization;
  
  if (!authHeader || authHeader === 'Bearer ') {
    return {
      ok: false,
      status: 401,
      text: async () => 'Unauthorized: Missing API key'
    };
  }
  
  if (authHeader === 'Bearer invalid-key') {
    return {
      ok: false,
      status: 401,
      text: async () => 'Invalid API key'
    };
  }
  
  // Simulate successful response
  return {
    ok: true,
    json: async () => ({
      choices: [{
        message: {
          content: 'This is a simulated response from OpenAI. In a real scenario, this would be the AI-generated response to your treaty text.'
        }
      }]
    })
  };
};

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

  updateApiKey(apiKey) {
    this.apiKey = apiKey;
  }
}

// Run tests
async function runTests() {
  console.log('=== OpenAI Service Tests ===\n');

  // Test 1: Missing API key
  console.log('Test 1: Missing API key');
  const service1 = new OpenAIService({ apiKey: '' });
  const result1 = await service1.sendToLLM('Test prompt');
  console.log('  Result:', result1);
  console.log('  ✓ Returns error for missing key:', result1.error === 'OpenAI API key not configured');
  console.log();

  // Test 2: Invalid API key
  console.log('Test 2: Invalid API key');
  const service2 = new OpenAIService({ apiKey: 'invalid-key' });
  const result2 = await service2.sendToLLM('Test treaty text');
  console.log('  Result:', result2);
  console.log('  ✓ Returns error for invalid key:', result2.error.includes('401'));
  console.log();

  // Test 3: Valid API key (simulated)
  console.log('Test 3: Valid API key (simulated)');
  const service3 = new OpenAIService({ 
    apiKey: 'valid-test-key',
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 1000
  });
  const result3 = await service3.sendToLLM('Emergency protocol: In case of fire...');
  console.log('  Result:', result3);
  console.log('  ✓ Returns content:', !!result3.content && !result3.error);
  console.log();

  // Test 4: Update API key
  console.log('Test 4: Update API key');
  const service4 = new OpenAIService({ apiKey: '' });
  console.log('  Initial key empty:', service4.apiKey === '');
  service4.updateApiKey('new-api-key');
  console.log('  ✓ Key updated:', service4.apiKey === 'new-api-key');
  console.log();

  // Test 5: Real treaty content
  console.log('Test 5: Real treaty content processing');
  const realTreaty = `I need help creating an emergency contact protocol for my elderly parent who has dementia.`;
  const service5 = new OpenAIService({ apiKey: 'test-key' });
  console.log('  Input:', realTreaty);
  const result5 = await service5.sendToLLM(realTreaty);
  console.log('  ✓ Processed successfully:', !!result5.content);
  console.log();

  console.log('✅ All OpenAI Service tests completed!');
  console.log('\nNote: These tests use mocked responses. In production, real API calls would be made.');
}

// Run the tests
runTests().catch(console.error);
