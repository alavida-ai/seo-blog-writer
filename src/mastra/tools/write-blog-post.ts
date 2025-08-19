import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { blogWritingWorkflow } from "../workflows/blog-writing-workflow";

export const writeBlogPostTool = createTool({
    id: "write-blog-post-tool",
    description: "Writes a blog post",
    inputSchema: z.object({
        topic: z.string().describe("The topic of the blog post that you wish to write about or target for SEO purposes"),
        brand: z.string().describe("The brand that you wish to publish the blog post for"),
    }),
    outputSchema: z.object({
        title: z.string().describe("The title of the blog post"),
        filePath: z.string().describe("The file path of the blog post")
    }),
    execute: async ({ context, mastra }) => {
    const { topic, brand } = context;
    const run = await blogWritingWorkflow.createRunAsync({});

    const runResult = await run!.start({
        inputData: {
        topic: topic,
        brand: brand
        }
    });

    const { content, title, filePath } = (runResult as any).result;

    return {
        title: title,
        filePath: filePath
    };
    }
});