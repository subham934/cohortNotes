import { ChatGoogle } from '@langchain/google';
import { ChatMistralAI } from '@langchain/mistralai';
import { ChatCohere } from '@langchain/cohere';
import { ChatOpenAI  } from '@langchain/openai';
import config from '../config/config.js';

/**
 * Initialize Gemini 2.5 Flash Model
 */
export const openAIModel = new ChatOpenAI({
  model: 'gpt-5',
  apiKey: config.OPENAI_API_KEY,
});

export const mistralModel = new ChatMistralAI({
  model: 'mistral-medium-latest',
  apiKey: config.MISTRAL_API_KEY,
});

export const cohereModel = new ChatCohere({
  model: 'command-a-03-2025',
  apiKey: config.COHERE_API_KEY,
});
