import { z } from "zod";
import { createTool } from "@mastra/core";
import { DESCRIPTION_WRITE } from "./todowrite";

const TodoInfo = z.object({
    content: z.string().describe("Brief description of the task"),
    status: z.string().describe("Current status of the task: pending, in_progress, completed, cancelled"),
    priority: z.string().describe("Priority level of the task: high, medium, low"),
    id: z.string().describe("Unique identifier for the todo item"),
  })

type TodoInfo = z.infer<typeof TodoInfo>


export const todoWriteTool = createTool({
    id: "Todo Write",
    description: DESCRIPTION_WRITE,
    inputSchema: z.object({
        todos: z.array(TodoInfo).describe("The updated todo list"),
    }),
    execute: async ({context, runtimeContext}) => {
        const todos = runtimeContext.get("todos");
        console.log("previous todos", todos);
        console.log("new todos", context.todos);
        runtimeContext.set("todos", context.todos);
        return context.todos;
    },
  });

export const todoReadTool = createTool({
  id: "Todo Read",
  description: "Reads the todo list from the database",
  inputSchema: z.object({}),
  execute: async ({context, runtimeContext}) => {
      const todos = runtimeContext.get("todos");
      console.log("todos", todos);
      return todos;
  },
}); 