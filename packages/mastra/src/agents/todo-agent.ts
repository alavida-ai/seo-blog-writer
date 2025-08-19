import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { Agent } from '@mastra/core/agent';
import { todoWriteTool } from '../tools/todo';
import { todoReadTool } from '../tools/todo';
import { getOpenRouter } from './router';
import { GPT_4O } from '../constants/models';

const openrouter = getOpenRouter();

export const todoAgent = new Agent({
  name: 'Todo Agent',
  instructions: `
     You are a todo list manager who helps the user manage their todo list.

    You use tools to read and write to the todo list.
`,
  model: openrouter(GPT_4O),
  tools: {
    todoReadTool,
    todoWriteTool
  },
});