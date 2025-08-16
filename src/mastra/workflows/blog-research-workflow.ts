import { researchAgent } from "../agents/seo-research-agent";
import { createStep, createWorkflow } from "@mastra/core";
import { z } from "zod";
import { getBrandFundamentals } from "../tools/get-brand-fundamentals-tool";
import { competitiveAnalysisAgent } from "../agents/competitive-analysis-agent";
import { contentWriterAgent } from "../agents/content-writer-agent";
import { AnthropicProviderOptions } from "@ai-sdk/anthropic";
import { OpenAIProvider } from "@ai-sdk/openai";

 
const seoResearchOutputSchema = z.object({
    primaryKeyword: z.object({
      keyword: z.string(),
      searchVolume: z.number(),
      difficulty: z.number(),
      intent: z.enum(['informational', 'commercial', 'transactional', 'navigational'])
    }),
    secondaryKeywords: z.array(z.object({
      keyword: z.string(),
      searchVolume: z.number(),
      relevance: z.enum(['high', 'medium', 'low'])
    })),
    contentAngle: z.string(), // e.g., "comparison", "alternative", "how-to"
    estimatedTrafficPotential: z.number()
    })
    
const inputSchema = z.object({
    topic: z.string(),
    brand: z.string()
})
    

const seoResearchStep = createStep({
  id: "seo-research-step",
  description: "Perform long tail keyword research for the topic",
  inputSchema: inputSchema,
  outputSchema: seoResearchOutputSchema,   
 
    execute: async ({ inputData }) => {
    const { topic, brand } = inputData;
    const brandFundamentals = await getBrandFundamentals();

    const  prompt = `Analyze keyword opportunities for: ${topic} Business context: ${brandFundamentals} 
    Use DataForSEO to: 1. Get search volume and difficulty for the main keyword 2. Find related long-tail variations 3. Try and find high volume keywords that are related to the brand, with low competition.
    Identify "${brand} alternative" and "${brand} vs" keywords 4. Find feature-specific keywords we can rank for Return the top keyword opportunity with 3-5 supporting keywords that we should target in a single comprehensive article.
    `
    const response = await researchAgent.generate(prompt, {
        experimental_output: seoResearchOutputSchema
      });

    const responseObject = response.object;

    if (!responseObject) {
        throw new Error("No response object received");
    }

    const primaryKeyword = responseObject.primaryKeyword;
    const secondaryKeywords = responseObject.secondaryKeywords;
    const contentAngle = responseObject.contentAngle;
    const estimatedTrafficPotential = responseObject.estimatedTrafficPotential;

    // Parse the text response into an array of keywords
    return {
      primaryKeyword: primaryKeyword,
      secondaryKeywords: secondaryKeywords,
      contentAngle: contentAngle,
      estimatedTrafficPotential: estimatedTrafficPotential
    };
  }
});


const contentAnalysisOutputSchema = z.object({
    contentAnalysis: z.string(),
    seoResearchOutput: seoResearchOutputSchema
})

const competitiveAnalysisStep = createStep({
  id: "competitive-analysis-step",
  description: "Analyze the competitive landscape",
  inputSchema: seoResearchOutputSchema ,
  outputSchema: contentAnalysisOutputSchema,   
 
    execute: async ({ inputData }) => {
    const { primaryKeyword } = inputData;

    const  prompt = `
    Analyze the top 3-4 ranking articles for: ${primaryKeyword.keyword}

    Using Firecrawl, extract and analyze:
    1. Content structure (heading hierarchy)
    2. Topics covered in detail vs. mentioned briefly
    3. Word count and depth per section
    4. Types of examples or data used
    5. Missing topics based on user intent

    Identify 3-5 content gaps where we can provide unique value:
    - Questions not answered
    - Use cases not covered  
    - Features not compared
    - Problems not addressed
    - Data/examples not provided

    Return a content opportunity analysis with specific gaps to fill.
    ` 
    const response = await competitiveAnalysisAgent.generate(prompt, {
        experimental_output: z.object({
            contentAnalysis: z.string()
        })
      });

    const responseObject = response.object;

    if (!responseObject) {
        throw new Error("No response object received");
    }

    const contentAnalysis = responseObject.contentAnalysis;

    // Parse the text response into an array of keywords
    return {
      contentAnalysis: contentAnalysis,
      seoResearchOutput: inputData
    };
  }
});

const contentResearchAndOutlineInputSchema = contentAnalysisOutputSchema

const contentResearchAndOutlineOutputSchema = z.object({
    contentOutline: z.string(),
    seoResearchOutput: seoResearchOutputSchema,
})

const contentResearchAndOutlineStep = createStep({
  id: "content-research-and-outline-step",
  description: "Research and outline the content",
  inputSchema: contentResearchAndOutlineInputSchema,
  outputSchema: contentResearchAndOutlineOutputSchema,   
 
    execute: async ({ inputData }) => {
    const { seoResearchOutput, contentAnalysis } = inputData;

    const  prompt = `
    Use the perplexity tool to research perform research on a blog post which the keywords. 

    The content angle is: ${seoResearchOutput.contentAngle}

    We previously analysed the highest ranking articles for the primary keyword and found the following content gaps, we should fill these gaps: ${contentAnalysis}

    The primary keyword is: ${seoResearchOutput.primaryKeyword.keyword}

    The secondary keywords are: ${seoResearchOutput.secondaryKeywords.map(keyword => keyword.keyword).join(', ')}

    You should include the primary goals of the blog post, and show the goals of each section and how they contribute to the primary goals.

    If you reference a source from your research, make sure to include the citation in the section.

    Ensure that the content outline allows for a 1500 word blog post, and flows well.

    You must reference the sources and insights from the research you conducted. In the outline include the points you have found in the research, the examples, and within each point includer the citation. 

    Do not leave the citation at the end of the blog post, include it in the section where you reference the source.

    Return the content outline as a markdown string.
    ` 
    const response = await contentWriterAgent.generate(prompt);

    const contentOutline = response.text;

    // Parse the text response into an array of keywords
    return {
      contentOutline: contentOutline,
      seoResearchOutput: seoResearchOutput,
    };
  }
});


const contentWritingOutputSchema = z.object({
    content: z.string(),
})

const contentWritingStep = createStep({
  id: "content-writing-step",
  description: "Write the content",
  inputSchema: contentResearchAndOutlineOutputSchema,
  outputSchema: contentWritingOutputSchema,   
 
    execute: async ({ inputData }) => {
    const { seoResearchOutput, contentOutline } = inputData;

    const  prompt = `
    Write a comprehensive article based on this intelligence:

    Target keyword: ${seoResearchOutput.primaryKeyword.keyword}
    Supporting keywords: ${seoResearchOutput.secondaryKeywords.map(keyword => keyword.keyword).join(', ')}
    Content outline: ${contentOutline}
    Content angle: ${seoResearchOutput.contentAngle}

    Requirements:
    1. Start with a compelling problem/solution opening
    2. Address each content gap with specific examples
    3. Naturally incorporate keywords (1-2% density)
    4. Write 1500+ words of value-dense content
    5. Include specific examples, not generic advice
    6. End with clear next steps

    Format as markdown with clear H2 and H3 sections.
    ` 
    // const response = await contentWriterAgent.generate(prompt, {
      //   experimental_output: z.object({
      //       content: z.string()
      //   })
      // });

    const { text, reasoning } = await contentWriterAgent.generate(
      [
        {
          role: "user",
          content: prompt,
        },
      ],
      {
        providerOptions: {
          anthropic: {
            thinking: { type: "enabled", budgetTokens: 12000 },
          } satisfies AnthropicProviderOptions,
        },
        // experimental_output: z.object({
        //   content: z.string()
        // })
      }
    );

    const content = text;

    console.log('this is the reasoning', reasoning);

    if (!content) {
        throw new Error("No response object received");
    }

    // Parse the text response into an array of keywords
    return {
      content: text,
    };
  }
});

export const blogResearchWorkflow = createWorkflow({
    id: "blog-research-workflow",
    description: "Research a topic and create a blog post",
    inputSchema: inputSchema,
    outputSchema: contentAnalysisOutputSchema,
})
  .then(seoResearchStep)
  .then(competitiveAnalysisStep)
  .then(contentResearchAndOutlineStep)
  .then(contentWritingStep)
  .commit();