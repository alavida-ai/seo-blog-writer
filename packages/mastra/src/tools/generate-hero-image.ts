import Replicate from "replicate";
import { createTool } from "@mastra/core";
import { z } from "zod";
import dotenv from 'dotenv';
dotenv.config({ path: '/Users/alexandergirardet/Code/vibeflow-projects/seo-blogs/.env' });

const generateHeroImageInput = (prompt: string) => ({
    prompt: prompt,
    go_fast: true,
    guidance: 3,
    megapixels: "1",
    num_outputs: 1,
    aspect_ratio: "1:1",
    output_format: "webp",  
    output_quality: 100,
    prompt_strength: 0.8,
    num_inference_steps: 28
  });    

export const generateHeroImage = async (prompt: string) => {
    try {
        const replicate = new Replicate({
            auth: process.env.REPLICATE_API_TOKEN!,
          });
        
        const output = await replicate.run("black-forest-labs/flux-krea-dev", { input: generateHeroImageInput(prompt) });
        // @ts-ignore
        return output[0].url();
    } catch (error) {
        console.error("Error generating hero image", error);
        throw error;
    }
}

export const generateHeroImageTool = createTool({
id: "Generate Hero Image",
description: `Generates a hero image for a given prompt`,
inputSchema: z.object({
    prompt: z.string(),
}),
execute: async ({ context: { prompt } }) => {
    console.log("Using tool to generate hero image");
    return await generateHeroImage(prompt);
},
});
  
  