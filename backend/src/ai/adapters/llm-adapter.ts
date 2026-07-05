import OpenAI from 'openai';
import { config } from '../../config';
import { ExternalServiceError, RateLimitError } from '../../common/errors';
import logger from '../../common/utils/logger';
import { AiDebugLog } from '../models/ai-debug-log.model';

export interface LLMProvider {
  generate(prompt: string, options?: LLMOptions): Promise<string>;
  generateWithSystemPrompt(systemPrompt: string, userPrompt: string, options?: LLMOptions): Promise<string>;
}

export interface LLMOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  stopSequences?: string[];
  responseMimeType?: string;
  maxRetries?: number;
  retryDelays?: number[];
}

const RETRY_DELAYS = [1000, 2000, 4000];
const MAX_RETRIES = 3;

export class GroqAdapter implements LLMProvider {
  private client: OpenAI;
  private model: string;

  constructor(apiKey?: string) {
    const key = apiKey || config.groq?.apiKey || '';
    if (!key || key.length < 8) {
      logger.error('GROQ_API_KEY is missing or too short — AI calls will fail');
    }
    this.client = new OpenAI({
      apiKey: key,
      baseURL: 'https://api.groq.com/openai/v1',
    });
    this.model = config.groq?.model || 'llama-3.3-70b-versatile';
  }

  async generate(prompt: string, options?: LLMOptions): Promise<string> {
    return this.generateWithSystemPrompt('You are a helpful AI learning assistant for the LENS platform.', prompt, options);
  }

  async generateWithSystemPrompt(systemPrompt: string, userPrompt: string, options?: LLMOptions): Promise<string> {
    return this.callWithRetry(systemPrompt, userPrompt, options, 0);
  }

  private async callWithRetry(
    systemPrompt: string,
    userPrompt: string,
    options: LLMOptions | undefined,
    attempt: number
  ): Promise<string> {
    const startTime = Date.now();
    const messages: any[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    const maxRetries = options?.maxRetries ?? MAX_RETRIES;
    const retryDelays = options?.retryDelays ?? RETRY_DELAYS;

    try {
      const completionOptions: any = {
        model: this.model,
        messages,
        temperature: options?.temperature ?? 0.2,
        max_tokens: options?.maxTokens ?? 8192,
        top_p: options?.topP ?? 0.9,
      };

      if (options?.responseMimeType === 'application/json') {
        completionOptions.response_format = { type: 'json_object' };
      }

      const response = await this.client.chat.completions.create(completionOptions);
      const duration = Date.now() - startTime;
      const text = response.choices?.[0]?.message?.content || '';

      if (response.usage) {
        AiDebugLog.create({
          sessionId: 'usage',
          module: 'llm-adapter',
          prompt: `${systemPrompt}\n\n${userPrompt}`.slice(0, 300),
          responseText: text.slice(0, 1000),
          aiModel: this.model,
          duration,
          tokensUsed: {
            prompt: response.usage.prompt_tokens || 0,
            completion: response.usage.completion_tokens || 0,
          },
        }).catch(() => {});
      }

      return text;
    } catch (error: any) {
      const duration = Date.now() - startTime;
      const isRateLimit = error?.status === 429;
      const isServerError = error?.status >= 500;

      if (isRateLimit && attempt < maxRetries) {
        const delay = retryDelays[attempt] || 1000;
        logger.warn(`Groq 429 on ${this.model} (attempt ${attempt + 1}/${maxRetries}), retrying in ${delay}ms`);
        AiDebugLog.create({
          sessionId: 'rate-limit',
          module: 'llm-adapter',
          prompt: `${systemPrompt}\n\n${userPrompt}`.slice(0, 500),
          responseText: error.message || '429',
          aiModel: this.model,
          duration,
          error: `429 attempt ${attempt + 1}`,
        }).catch(() => {});
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.callWithRetry(systemPrompt, userPrompt, options, attempt + 1);
      }

      if (isServerError && attempt < maxRetries) {
        const delay = retryDelays[attempt] || 1000;
        logger.warn(`Groq ${error.status} on ${this.model} (attempt ${attempt + 1}/${maxRetries}), retrying in ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.callWithRetry(systemPrompt, userPrompt, options, attempt + 1);
      }

      const errMsg = error?.error?.message || error?.message || 'Unknown Groq API error';
      const statusCode = error?.status || 502;

      AiDebugLog.create({
        sessionId: 'error',
        module: 'llm-adapter',
        prompt: `${systemPrompt}\n\n${userPrompt}`.slice(0, 500),
        responseText: '',
        aiModel: this.model,
        duration,
        error: `${statusCode}: ${errMsg}`,
      }).catch(() => {});

      logger.error(`Groq API error (${statusCode}): ${errMsg}`);
      throw new ExternalServiceError(`AI analysis failed: ${errMsg}`, 'Groq');
    }
  }
}

export class GeminiAdapter implements LLMProvider {
  private apiKey: string;
  private model: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta';

  constructor(apiKey?: string, model?: string) {
    this.apiKey = apiKey || config.gemini.apiKey;
    this.model = model || config.gemini.model;
  }

  async generate(prompt: string, options?: LLMOptions): Promise<string> {
    return this.generateWithSystemPrompt('You are a helpful AI learning assistant for the LENS platform.', prompt, options);
  }

  async generateWithSystemPrompt(systemPrompt: string, userPrompt: string, options?: LLMOptions): Promise<string> {
    return this.callWithRetry(systemPrompt, userPrompt, options, this.model, 0);
  }

  private async callWithRetry(
    systemPrompt: string,
    userPrompt: string,
    options: LLMOptions | undefined,
    model: string,
    attempt: number
  ): Promise<string> {
    const startTime = Date.now();
    const combinedPrompt = `${systemPrompt}\n\n${userPrompt}`;

    try {
      const body: any = {
        contents: [{ role: 'user', parts: [{ text: combinedPrompt }] }],
        generationConfig: {
          temperature: options?.temperature ?? 0.2,
          maxOutputTokens: options?.maxTokens ?? 8192,
          topP: options?.topP ?? 0.9,
        },
      };

      if (options?.responseMimeType === 'application/json') {
        body.generationConfig.responseMimeType = 'application/json';
      }

      const response = await fetch(
        `${this.baseUrl}/models/${model}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      );

      const duration = Date.now() - startTime;

      if (response.status === 429 && attempt < MAX_RETRIES) {
        const errBody: any = await response.json().catch(() => ({}));
        logger.warn(`Gemini 429 on ${model} (attempt ${attempt + 1}/${MAX_RETRIES})`);
        AiDebugLog.create({
          sessionId: 'rate-limit',
          module: 'llm-adapter',
          prompt: combinedPrompt.slice(0, 500),
          responseText: JSON.stringify(errBody),
          aiModel: model,
          duration,
          error: '429 rate limited',
        }).catch(() => {});
        const delay = RETRY_DELAYS[Math.min(attempt, RETRY_DELAYS.length - 1)];
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.callWithRetry(systemPrompt, userPrompt, options, model, attempt + 1);
      }

      if (!response.ok) {
        const errData: any = await response.json().catch(() => ({}));
        const errMsg = errData?.error?.message || response.statusText;
        throw new ExternalServiceError(`AI analysis failed: Gemini error (${response.status}): ${errMsg}`, 'Gemini');
      }

      const data: any = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

      if (data?.usageMetadata) {
        AiDebugLog.create({
          sessionId: 'usage',
          module: 'llm-adapter',
          prompt: combinedPrompt.slice(0, 300),
          responseText: text.slice(0, 1000),
          aiModel: model,
          duration,
          tokensUsed: {
            prompt: data.usageMetadata.promptTokenCount || 0,
            completion: data.usageMetadata.candidatesTokenCount || 0,
          },
        }).catch(() => {});
      }

      return text;
    } catch (error: any) {
      const duration = Date.now() - startTime;

      if (error instanceof ExternalServiceError) {
        if (attempt < MAX_RETRIES) {
          const delay = RETRY_DELAYS[Math.min(attempt, RETRY_DELAYS.length - 1)];
          logger.warn(`Retrying ${model} in ${delay}ms (attempt ${attempt + 1}/${MAX_RETRIES})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          return this.callWithRetry(systemPrompt, userPrompt, options, model, attempt + 1);
        }
        AiDebugLog.create({
          sessionId: 'error',
          module: 'llm-adapter',
          prompt: combinedPrompt.slice(0, 500),
          responseText: '',
          aiModel: model,
          duration,
          error: error.message,
        }).catch(() => {});
        throw error;
      }

      logger.error('Gemini API unexpected error:', error);
      throw new ExternalServiceError(`AI analysis failed: ${error.message || 'Unknown error'}`, 'Gemini');
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
    return this.generateWithSystemPrompt('You are a helpful AI learning assistant for the LENS platform.', prompt, options);
  }

  async generateWithSystemPrompt(systemPrompt: string, userPrompt: string, options?: LLMOptions): Promise<string> {
    return withRetry(async () => {
      try {
        const body: any = {
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: options?.temperature ?? 0.2,
          max_tokens: options?.maxTokens ?? 8192,
          top_p: options?.topP ?? 0.9,
        };

        if (options?.responseMimeType === 'application/json') {
          body.response_format = { type: 'json_object' };
        }

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
            'HTTP-Referer': 'https://lens-platform.app',
            'X-Title': 'LENS Learning Platform',
          },
          body: JSON.stringify(body),
        });

        if (response.status === 429) {
          throw new RateLimitError('OpenRouter rate limited');
        }

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
        if (error instanceof RateLimitError || error instanceof ExternalServiceError) throw error;
        throw new ExternalServiceError('Failed to generate AI response via OpenRouter', 'OpenRouter');
      }
    });
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
    return this.generateWithSystemPrompt('You are a helpful AI learning assistant for the LENS platform.', prompt, options);
  }

  async generateWithSystemPrompt(systemPrompt: string, userPrompt: string, options?: LLMOptions): Promise<string> {
    return withRetry(async () => {
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
              temperature: options?.temperature ?? 0.2,
              num_predict: options?.maxTokens ?? 8192,
              top_p: options?.topP ?? 0.9,
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
        throw new ExternalServiceError('Failed to generate AI response via Ollama', 'Ollama');
      }
    });
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
    return this.generateWithSystemPrompt('You are a helpful AI learning assistant for the LENS platform.', prompt, options);
  }

  async generateWithSystemPrompt(systemPrompt: string, userPrompt: string, options?: LLMOptions): Promise<string> {
    return withRetry(async () => {
      try {
        const body: any = {
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: options?.temperature ?? 0.2,
          max_tokens: options?.maxTokens ?? 8192,
          top_p: options?.topP ?? 0.9,
        };

        if (options?.responseMimeType === 'application/json') {
          body.response_format = { type: 'json_object' };
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify(body),
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
        throw new ExternalServiceError('Failed to generate AI response', 'OpenAI');
      }
    });
  }
}

async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      if (attempt === MAX_RETRIES) throw error;
      const delay = RETRY_DELAYS[attempt];
      logger.warn(`Attempt ${attempt + 1}/${MAX_RETRIES + 1} failed: ${error.message}. Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Retry exhausted');
}

class RequestQueue {
  private queue: Array<{ fn: () => Promise<any>; resolve: (v: any) => void; reject: (e: any) => void }> = [];
  private processing = false;
  private timestamps: number[] = [];
  private maxRequestsPerMinute = 25;

  async enqueue<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({ fn, resolve, reject });
      this.processQueue();
    });
  }

  private async processQueue(): Promise<void> {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length > 0) {
      await this.throttle();
      const item = this.queue.shift();
      if (item) {
        try {
          const result = await item.fn();
          item.resolve(result);
        } catch (error) {
          item.reject(error);
        }
      }
    }

    this.processing = false;
  }

  private async throttle(): Promise<void> {
    const now = Date.now();
    this.timestamps = this.timestamps.filter(t => now - t < 60000);
    if (this.timestamps.length >= this.maxRequestsPerMinute) {
      const oldest = this.timestamps[0];
      const waitTime = 60000 - (now - oldest) + 50;
      logger.info(`Groq queue: waiting ${waitTime}ms (${this.timestamps.length}/${this.maxRequestsPerMinute} req/min)`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    this.timestamps.push(Date.now());
  }
}

const requestQueue = new RequestQueue();

class LLMAdapter {
  private static instance: LLMAdapter;
  private provider: LLMProvider;
  private fallbackProviders: LLMProvider[] = [];

  private constructor() {
    this.provider = this.createPrimaryProvider();

    logger.info(`LLM primary provider: ${this.provider.constructor.name}`);
    if (this.provider instanceof GroqAdapter) {
      const key = config.groq?.apiKey || '';
      logger.info(`Groq API key loaded: ${key ? key.substring(0, 4) + '...' : 'MISSING'}`);
    }

    this.fallbackProviders = this.createFallbackProviders();
  }

  private createPrimaryProvider(): LLMProvider {
    const providerName = config.llm?.provider || 'auto';

    if (providerName === 'groq' || (providerName === 'auto' && config.groq?.apiKey)) {
      return new GroqAdapter();
    }
    if (providerName === 'gemini' || (providerName === 'auto' && config.gemini?.apiKey)) {
      return new GeminiAdapter();
    }
    if (providerName === 'openrouter' || (providerName === 'auto' && config.openrouter?.apiKey)) {
      return new OpenRouterAdapter();
    }
    if (providerName === 'openai' || (providerName === 'auto' && config.openai?.apiKey)) {
      return new OpenAIAdapter(config.openai.apiKey || '', config.openai.model);
    }
    if (providerName === 'ollama' || providerName === 'auto') {
      return new OllamaAdapter();
    }

    return new GroqAdapter();
  }

  private createFallbackProviders(): LLMProvider[] {
    const providers: LLMProvider[] = [];
    const primary = this.provider;

    if (config.gemini?.apiKey && !(primary instanceof GeminiAdapter)) {
      providers.push(new GeminiAdapter());
    }
    if (config.openrouter?.apiKey && !(primary instanceof OpenRouterAdapter)) {
      providers.push(new OpenRouterAdapter());
    }
    if (config.openai?.apiKey && !(primary instanceof OpenAIAdapter)) {
      providers.push(new OpenAIAdapter(config.openai.apiKey, config.openai.model));
    }
    if (!(primary instanceof OllamaAdapter)) {
      providers.push(new OllamaAdapter());
    }

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
    return requestQueue.enqueue(async () => {
      try {
        return await instance.provider.generate(prompt, options);
      } catch (error: any) {
        logger.warn(`Primary (${instance.provider.constructor.name}) failed: ${error.message}`);
        for (const fallback of instance.fallbackProviders) {
          try {
            logger.info(`Trying fallback: ${fallback.constructor.name}`);
            return await fallback.generate(prompt, options);
          } catch (fallbackError: any) {
            logger.warn(`Fallback (${fallback.constructor.name}) also failed: ${fallbackError.message}`);
          }
        }
        throw error;
      }
    });
  }

  static async generateWithSystemPrompt(
    systemPrompt: string,
    userPrompt: string,
    options?: LLMOptions
  ): Promise<string> {
    const instance = LLMAdapter.getInstance();
    return requestQueue.enqueue(async () => {
      try {
        return await instance.provider.generateWithSystemPrompt(systemPrompt, userPrompt, options);
      } catch (error: any) {
        logger.warn(`Primary (${instance.provider.constructor.name}) failed: ${error.message}`);
        for (const fallback of instance.fallbackProviders) {
          try {
            logger.info(`Trying fallback: ${fallback.constructor.name}`);
            return await fallback.generateWithSystemPrompt(systemPrompt, userPrompt, options);
          } catch (fallbackError: any) {
            logger.warn(`Fallback (${fallback.constructor.name}) also failed: ${fallbackError.message}`);
          }
        }
        throw error;
      }
    });
  }

  static setProvider(provider: LLMProvider): void {
    LLMAdapter.getInstance().provider = provider;
  }
}

export default LLMAdapter;
