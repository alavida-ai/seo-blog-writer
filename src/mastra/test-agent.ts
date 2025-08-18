import { Agent } from '@mastra/core/agent';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { CLAUDE_SONNET_4 } from './constants/models';
import dotenv from 'dotenv';
dotenv.config({ path: '/Users/alexandergirardet/Code/vibeflow-projects/seo-blogs/.env' });
import { z } from 'zod';

// Initialize the OpenRouter provider
const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

// Create an agent using OpenRouter
const assistant = new Agent({
  model: openrouter(CLAUDE_SONNET_4),
  name: 'Assistant',
  instructions: 'You are a helpful assistant.',
});

const schema = z.object({
  capital: z.string(),
});

const prompt = `
  What is the capital of France?
`;

// Generate a response
const result = await assistant.generate(prompt, {
    output: schema
  });   

console.log(result.object?.capital);
