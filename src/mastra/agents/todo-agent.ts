import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { todoWriteTool } from '../tools/todo';
import { todoReadTool } from '../tools/todo';


export const todoAgent = new Agent({
  name: 'Todo Agent',
  instructions: `
     You are a todo list manager who helps the user manage their todo list.

    You use tools to read and write to the todo list.
`,
  model: openai(`gpt-4o`),
  tools: {
    todoReadTool,
    todoWriteTool
  },
});