import { researchAgent } from "../agents/seo-research-agent";
import { createStep, createWorkflow } from "@mastra/core";
import { z } from "zod";
import { getBrandFundamentals } from "../tools/get-brand-fundamentals-tool";
import { competitiveAnalysisAgent } from "../agents/competitive-analysis-agent";
import { contentWriterAgent } from "../agents/content-writer-agent";

import { writeBlogPost } from "../tools/write-report";

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
    const brandFundamentals = await getBrandFundamentals(brand);

    const  prompt = `Your job is identify long tail SEO keyword opportunities for our business to target this topic: ${topic}. 

    The business is: ${brand} and the business context is: ${brandFundamentals} 

    You need to reason how the keywords are relevant to the business and the topic.

    You should back up your keywords with data from DataForSEO.

    Use DataForSEO to: 1. Get search volume and difficulty for the main keyword 2. Find related long-tail variations 3. Try and find high volume keywords that are related to the brand, with low competition.
    
    Your job is to identify the best keywords to target for the business, that will allow us to rank for the topic. 

    Return the top keyword opportunity with 3-5 supporting keywords that we should target in a single comprehensive article.

    Provide:
    - Primary keyword with search volume, difficulty, and intent classification
    - 3-5 secondary keywords with search volume and relevance rating
    - Content angle (how to approach the topic)
    - Estimated traffic potential
    `
    // const response = await researchAgent.generate(prompt, {
    //   output: {
    //     schema: seoResearchOutputSchema,
    //   },
    //     providerOptions: {
    //       anthropic: {
    //         thinking: { type: "enabled", budgetTokens: 12000 },
    //       } satisfies AnthropicProviderOptions,
    //     },
    //   });


    const result = await researchAgent.generate(prompt, {
      output: seoResearchOutputSchema
    });

    const responseObject = result.object;

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
        output: z.object({
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

    Return the content outline as a markdown string, make sure you include the blog post in the <blog> tag.

    Example:
    <blog>
    This is the blog post.
    </blog>
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
    title: z.string(),
    seoData: seoResearchOutputSchema,
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

    const { object, reasoning } = await contentWriterAgent.generate(prompt, {
        providerOptions: {
          anthropic: {
            thinking: { type: "enabled", budgetTokens: 12000 },
          },
        },
        output: contentWritingOutputSchema
      },
    );

    if (!object) {
        throw new Error("No response object received");
    }

    const { content, title } = object;

    console.log('this is the reasoning', reasoning);
    return {
      content: content,
      title: title,
      seoData: inputData.seoResearchOutput
    };
  }
});

const prepareBlogPostOutputSchema = z.object({
  content: z.string(),
  title: z.string(),
  seoData: seoResearchOutputSchema
});

const prepareBlogPostStep = createStep({
  id: "prepare-blog-post-step",
  description: "Prepare the blog post content (normalize formatting, but don't write to file yet)",
  inputSchema: contentWritingOutputSchema,
  outputSchema: prepareBlogPostOutputSchema,
  execute: async ({ inputData }) => {
    const { content, title, seoData } = inputData;
    
    // Normalize content formatting to ensure proper spacing and line endings
    let normalizedContent = content;
    
    // Handle potential JSON string content
    if (typeof content === 'string' && content.trim().startsWith('{')) {
      try {
        const parsed = JSON.parse(content);
        normalizedContent = parsed.content || content;
      } catch {
        // If JSON parsing fails, use content as-is
        normalizedContent = content;
      }
    }
    
    // Normalize line endings and ensure consistent spacing
    normalizedContent = normalizedContent
      .replace(/\r\n/g, '\n') // Convert Windows line endings
      .replace(/\r/g, '\n') // Convert Mac line endings
      .replace(/\n{3,}/g, '\n\n') // Limit consecutive newlines to maximum 2
      .trim(); // Remove leading/trailing whitespace
    
    console.log(`📝 Blog post content prepared: ${title}`);
    
    return {
      content: normalizedContent,
      title,
      seoData
    };
  }
});

const addImagesOutputSchema = z.object({
  content: z.string(),
  title: z.string(),
  filePath: z.string()
});

const addImagesStep = createStep({
  id: "add-images-step",
  description: "Add images to the blog post and write the final version to file",
  inputSchema: prepareBlogPostOutputSchema,
  outputSchema: addImagesOutputSchema,
  execute: async ({ inputData, mastra }) => {
    const { content, title, seoData } = inputData;
    
    console.log(`🖼️ Adding images to blog post: ${title}`);
    
    // Get the blog image workflow from mastra
    const imageWorkflow = mastra!.getWorkflow("blogImageWorkflow");
    
    if (!imageWorkflow) {
      console.warn("⚠️ Blog image workflow not found, writing blog post without images");
      
      // Create a filename from the title (sanitize it for filesystem)
      const sanitizedTitle = title
        .toLowerCase()
        .replace(/[<>:"/\\|?*]/g, '') // Remove only filesystem-unsafe characters
        .replace(/[^\w\s-]/g, '') // Keep only word characters, spaces, and hyphens
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
        .trim();
      
      // Write the blog post without images
      const filePath = await writeBlogPost(
        sanitizedTitle,
        content,
        title,
        seoData
      );
      
      console.log(`✅ Blog post written without images: ${filePath}`);
      
      return {
        content,
        title,
        filePath
      };
    }
    
    try {
      // Run the image workflow
      const imageRun = await imageWorkflow.createRunAsync({});
      const imageResult = await imageRun.start({
        inputData: {
          blogPost: content,
          title: title
        }
      });
      
      const { blogPost: contentWithImages } = (imageResult as any).result;
      
      // Re-write the blog post with images
      const sanitizedTitle = title
        .toLowerCase()
        .replace(/[<>:"/\\|?*]/g, '') // Remove only filesystem-unsafe characters
        .replace(/[^\w\s-]/g, '') // Keep only word characters, spaces, and hyphens
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
        .trim();
      
      // Re-write the file with images
      const newFilePath = await writeBlogPost(
        sanitizedTitle,
        contentWithImages,
        title,
        seoData
      );
      
      console.log(`✅ Blog post updated with images: ${newFilePath}`);
      
      return {
        content: contentWithImages,
        title,
        filePath: newFilePath
      };
      
    } catch (error) {
      console.error("❌ Error adding images to blog post:", error);
      console.log("📝 Writing blog post without images due to error");
      
      // Create a filename from the title (sanitize it for filesystem)
      const sanitizedTitle = title
        .toLowerCase()
        .replace(/[<>:"/\\|?*]/g, '') // Remove only filesystem-unsafe characters
        .replace(/[^\w\s-]/g, '') // Keep only word characters, spaces, and hyphens
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
        .trim();
      
      // Write the blog post without images
      const filePath = await writeBlogPost(
        sanitizedTitle,
        content,
        title,
        seoData
      );
      
      console.log(`✅ Blog post written without images: ${filePath}`);
      
      return {
        content,
        title,
        filePath
      };
    }
  }
});

export const blogWritingWorkflow = createWorkflow({
    id: "blog-writing-workflow",
    description: "Research a topic, analyse the competitive landscape, outline the content, write the content, prepare the blog post, and add images",
    inputSchema: inputSchema,
    outputSchema: addImagesOutputSchema,
})
  .then(seoResearchStep)
  .then(competitiveAnalysisStep)
  .then(contentResearchAndOutlineStep)
  .then(contentWritingStep)
  .then(prepareBlogPostStep)
  .then(addImagesStep)
  .commit();