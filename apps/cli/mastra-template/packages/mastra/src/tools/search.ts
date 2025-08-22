import { createTool } from "@mastra/core";
import { tavily } from "@tavily/core";
import { z } from "zod";

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });


const MAX_DEPTH = 5;

// Report and Citation Variables
let reportBuilder = "";
let reportWithCitationBuilder = "";
let citations = "";
let statsReport = "";
let relatedImages = "";
let imageCount = 0;


export async function imageSearch(query: string): Promise<string[]> {
  let images: string[] = [];

  const diagramres = await tvly.search(query, {
    searchDepth: "basic",
    includeImages: true,
    includeImageDescriptions: true,
  });

  const diagram = diagramres.images[0];
  if (diagram.url) {
    images.push(diagram.url);
  }

  console.log(images);

  return images;
}

export const searchImage = createTool({
    id: "search-image",
    description: "Search the web for images based on a query.",
    inputSchema: z.object({
      searchQuery: z.string().describe("The query to search for images."),
    }),
    outputSchema: z.object({
      images: z
        .array(z.string())
        .optional()
        .describe("The array of image URLs"),
    }),
    execute: async ({ context }) => {
      const images = await imageSearch(context.searchQuery);
      return { images };
    },
  });