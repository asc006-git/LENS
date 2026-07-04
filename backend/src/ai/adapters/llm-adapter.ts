import { config } from '../../config';
import { ExternalServiceError } from '../../common/errors';
import logger from '../../common/utils/logger';

export interface LLMProvider {
  generate(prompt: string, options?: LLMOptions): Promise<string>;
  generateWithSystemPrompt(systemPrompt: string, userPrompt: string, options?: LLMOptions): Promise<string>;
}

export interface LLMOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  stopSequences?: string[];
}

export class GeminiAdapter implements LLMProvider {
  private apiKey: string;
  private model: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta';

  constructor() {
    this.apiKey = config.gemini.apiKey;
    this.model = config.gemini.model;
  }

  async generate(prompt: string, options?: LLMOptions): Promise<string> {
    return this.generateWithSystemPrompt('You are a helpful AI learning assistant.', prompt, options);
  }

  async generateWithSystemPrompt(systemPrompt: string, userPrompt: string, options?: LLMOptions): Promise<string> {
    try {
      const response = await fetch(
        `${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
            generationConfig: {
              temperature: options?.temperature || 0.7,
              maxOutputTokens: options?.maxTokens || 4096,
              topP: options?.topP || 0.9,
            },
          }),
        }
      );

      if (!response.ok) {
        const errData: any = await response.json();
        throw new ExternalServiceError(
          `Gemini API error: ${errData?.error?.message || 'Unknown error'}`,
          'Gemini'
        );
      }

      const data: any = await response.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } catch (error: any) {
      if (error instanceof ExternalServiceError) throw error;
      logger.error('Gemini API error:', error);
      throw new ExternalServiceError('Failed to generate AI response', 'Gemini');
    }
  }
}

export class OpenRouterAdapter implements LLMProvider {
  private apiKey: string;
  private model: string;

  constructor(apiKey?: string, model?: string) {
    this.apiKey = apiKey || config.openrouter?.apiKey || '';
    this.model = model || config.openrouter?.model || 'mistralai/mistral-7b-instruct:free';
  }

  async generate(prompt: string, options?: LLMOptions): Promise<string> {
    return this.generateWithSystemPrompt('You are a helpful AI learning assistant.', prompt, options);
  }

  async generateWithSystemPrompt(systemPrompt: string, userPrompt: string, options?: LLMOptions): Promise<string> {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': 'https://lens-platform.app',
          'X-Title': 'LENS Learning Platform',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: options?.temperature || 0.7,
          max_tokens: options?.maxTokens || 4096,
          top_p: options?.topP || 0.9,
        }),
      });

      if (!response.ok) {
        const errData: any = await response.json();
        throw new ExternalServiceError(
          `OpenRouter API error: ${errData?.error?.message || 'Unknown error'}`,
          'OpenRouter'
        );
      }

      const data: any = await response.json();
      return data?.choices?.[0]?.message?.content || '';
    } catch (error: any) {
      if (error instanceof ExternalServiceError) throw error;
      logger.error('OpenRouter API error:', error);
      throw new ExternalServiceError('Failed to generate AI response via OpenRouter', 'OpenRouter');
    }
  }
}

export class OllamaAdapter implements LLMProvider {
  private baseUrl: string;
  private model: string;

  constructor(baseUrl?: string, model?: string) {
    this.baseUrl = baseUrl || config.ollama?.baseUrl || 'http://localhost:11434';
    this.model = model || config.ollama?.model || 'llama3.2';
  }

  async generate(prompt: string, options?: LLMOptions): Promise<string> {
    return this.generateWithSystemPrompt('You are a helpful AI learning assistant.', prompt, options);
  }

  async generateWithSystemPrompt(systemPrompt: string, userPrompt: string, options?: LLMOptions): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          stream: false,
          options: {
            temperature: options?.temperature || 0.7,
            num_predict: options?.maxTokens || 4096,
            top_p: options?.topP || 0.9,
          },
        }),
      });

      if (!response.ok) {
        throw new ExternalServiceError('Ollama API error: service unavailable', 'Ollama');
      }

      const data: any = await response.json();
      return data?.message?.content || '';
    } catch (error: any) {
      if (error instanceof ExternalServiceError) throw error;
      logger.error('Ollama API error:', error);
      throw new ExternalServiceError('Failed to generate AI response via Ollama', 'Ollama');
    }
  }
}

export class OpenAIAdapter implements LLMProvider {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string = 'gpt-4') {
    this.apiKey = apiKey;
    this.model = model;
  }

  async generate(prompt: string, options?: LLMOptions): Promise<string> {
    return this.generateWithSystemPrompt('You are a helpful AI learning assistant.', prompt, options);
  }

  async generateWithSystemPrompt(systemPrompt: string, userPrompt: string, options?: LLMOptions): Promise<string> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: options?.temperature || 0.7,
          max_tokens: options?.maxTokens || 4096,
          top_p: options?.topP || 0.9,
        }),
      });

      if (!response.ok) {
        const errData: any = await response.json();
        throw new ExternalServiceError(
          `OpenAI API error: ${errData?.error?.message || 'Unknown error'}`,
          'OpenAI'
        );
      }

      const data: any = await response.json();
      return data?.choices?.[0]?.message?.content || '';
    } catch (error: any) {
      if (error instanceof ExternalServiceError) throw error;
      logger.error('OpenAI API error:', error);
      throw new ExternalServiceError('Failed to generate AI response', 'OpenAI');
    }
  }
}

class LLMAdapter {
  private static instance: LLMAdapter;
  private provider: LLMProvider;
  private fallbackProviders: LLMProvider[] = [];

  private constructor() {
    this.provider = this.createProviderFromConfig();
    this.fallbackProviders = this.createFallbackProviders();
  }

  private createProviderFromConfig(): LLMProvider {
    const provider = config.llm?.provider || 'auto';

    if (provider === 'openrouter' && config.openrouter?.apiKey) {
      logger.info('Using OpenRouter as LLM provider');
      return new OpenRouterAdapter();
    }

    if (provider === 'ollama') {
      logger.info('Using Ollama as LLM provider');
      return new OllamaAdapter();
    }

    if (provider === 'openai' && config.openai?.apiKey) {
      logger.info('Using OpenAI as LLM provider');
      return new OpenAIAdapter(config.openai.apiKey, config.openai.model);
    }

    if (config.gemini?.apiKey && config.gemini.apiKey.startsWith('AIzaSy')) {
      logger.info('Using Gemini as LLM provider');
      return new GeminiAdapter();
    }

    logger.info('Auto-selecting best available LLM provider');
    if (config.openrouter?.apiKey) return new OpenRouterAdapter();
    if (config.openai?.apiKey) return new OpenAIAdapter(config.openai.apiKey, config.openai.model);
    return new OllamaAdapter();
  }

  private createFallbackProviders(): LLMProvider[] {
    const providers: LLMProvider[] = [];
    if (config.openrouter?.apiKey) providers.push(new OpenRouterAdapter());
    providers.push(new OllamaAdapter());
    return providers;
  }

  static getInstance(): LLMAdapter {
    if (!LLMAdapter.instance) {
      LLMAdapter.instance = new LLMAdapter();
    }
    return LLMAdapter.instance;
  }

  static async generate(prompt: string, options?: LLMOptions): Promise<string> {
    const instance = LLMAdapter.getInstance();
    try {
      return await instance.provider.generate(prompt, options);
    } catch (error: any) {
      logger.warn(`Primary provider failed: ${error.message}, trying fallbacks...`);
      for (const fallback of instance.fallbackProviders) {
        try {
          return await fallback.generate(prompt, options);
        } catch (fallbackError: any) {
          logger.warn(`Fallback provider failed: ${fallbackError.message}`);
        }
      }
      throw error;
    }
  }

  static async generateWithSystemPrompt(
    systemPrompt: string,
    userPrompt: string,
    options?: LLMOptions
  ): Promise<string> {
    const instance = LLMAdapter.getInstance();
    try {
      return await instance.provider.generateWithSystemPrompt(systemPrompt, userPrompt, options);
    } catch (error: any) {
      logger.warn(`Primary provider failed: ${error.message}, trying fallbacks...`);
      for (const fallback of instance.fallbackProviders) {
        try {
          return await fallback.generateWithSystemPrompt(systemPrompt, userPrompt, options);
        } catch (fallbackError: any) {
          logger.warn(`Fallback provider failed: ${fallbackError.message}`);
        }
      }
      throw error;
    }
  }

  static setProvider(provider: LLMProvider): void {
    LLMAdapter.getInstance().provider = provider;
  }
}

export default LLMAdapter;
