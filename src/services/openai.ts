import { LLMResponse } from '../types';

interface OpenAIConfig {
  apiKey: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export class OpenAIService {
  private apiKey: string;
  private model: string;
  private temperature: number;
  private maxTokens: number;

  constructor(config: OpenAIConfig) {
    this.apiKey = config.apiKey;
    this.model = config.model || 'gpt-3.5-turbo';
    this.temperature = config.temperature || 0.7;
    this.maxTokens = config.maxTokens || 1000;
  }

  async sendToLLM(prompt: string): Promise<LLMResponse> {
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
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  updateApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  updateModel(model: string) {
    this.model = model;
  }
}

// Singleton instance
let openAIInstance: OpenAIService | null = null;

export const getOpenAIService = (apiKey?: string): OpenAIService => {
  if (!openAIInstance) {
    openAIInstance = new OpenAIService({ apiKey: apiKey || '' });
  } else if (apiKey) {
    openAIInstance.updateApiKey(apiKey);
  }
  return openAIInstance;
};
