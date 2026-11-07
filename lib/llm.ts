import OpenAI from 'openai';

// OpenAI-compatible: Fireworks in dev, Vultr Serverless Inference in demo (D-13).
export const llm = new OpenAI({ baseURL: process.env.LLM_BASE_URL, apiKey: process.env.LLM_API_KEY || 'missing', timeout: 30_000, maxRetries: 0 });
export const LLM_MODEL = process.env.LLM_MODEL ?? '';
