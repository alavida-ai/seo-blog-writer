import { createTool } from "@mastra/core/tools";
import { z } from "zod";
 
export const generateImagesWorkflowTool = createTool({
  id: "generate-images-tool",
  description: "Generates images for a blog post",
  inputSchema: z.object({
    content: z.string(),
    title: z.string()
  }),
  outputSchema: z.object({
    content: z.string(),
    title: z.string()
  }),
  execute: async ({ context, mastra }) => {
    const { content, title } = context;
    const workflow = mastra!.getWorkflow("blogImageWorkflow");
    const run = await workflow!.createRunAsync({});
 
    const runResult = await run!.start({
      inputData: {
        blogPost: content,
        title: title
      }
    });
 
    const { blogPost } = (runResult as any).result;
 
    return {
      content: blogPost,
      title: title
    };
  }
});