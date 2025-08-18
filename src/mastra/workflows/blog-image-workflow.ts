import { createStep, createWorkflow } from "@mastra/core";
import { z } from "zod";
import { contentWriterAgent } from "../agents/content-writer-agent";
import { imageSearch } from "../tools/search";

const blogImagePlaceholderStep = createStep({
  id: "blog-image-placeholder-step",
  description: "Add image placeholder queries into a blog post",
  inputSchema: z.object({
    blogPost: z.string(),
    title: z.string()
  }),
  outputSchema: z.object({
    blogPost: z.string()
  }),
  execute: async ({ inputData }) => {
    const { blogPost, title } = inputData;
    const prompt = `Your job is to rewrite this blog post exactly as is, but identify 2-3 strategic locations where adding an image would enhance readability and engagement.

    Do not change any content in the blog post. Simply inject image blocks in relevant locations using this exact format:

    <image>
    <image-query>
    A specific, descriptive search query for the image that relates to the surrounding content
    </image-query>
    <image-caption>
    A compelling caption that adds context and enhances the reader's understanding
    </image-caption>
    </image>

    Guidelines:
    - Place images at natural break points in the content
    - Make image queries specific and searchable (e.g., "modern office workspace with laptops" not just "office")
    - Write captions that complement the text and provide additional value
    - Ensure each image enhances the narrative flow

    Here is the blog post: ${blogPost}

    Output the blog post with injected image blocks inside <blog> tags.
    `

    const response = await contentWriterAgent.generate(prompt);

    const blogPostWithQueries = response.text;

    return { blogPost: blogPostWithQueries };
  }
});

const extractImageQueriesStep = createStep({
  id: "extract-image-queries-step",
  description: "Extract image queries and captions from a blog post",
  inputSchema: z.object({
    blogPost: z.string()
  }),
  outputSchema: z.object({
    imageSearchQueries: z.array(z.string()),
    imageCaptions: z.array(z.string()),
    blogPost: z.string()
  }),
  execute: async ({ inputData }) => {
    const { blogPost } = inputData;

    const imageTagQueries = blogPost.match(/<image-query>(.*?)<\/image-query>/gs);
    const imageCaptionTags = blogPost.match(/<image-caption>(.*?)<\/image-caption>/gs);

    if (!imageTagQueries) {
      throw new Error("No image tag queries found");
    }

    const imageSearchQueries = imageTagQueries.map((query) => query.replace(/<image-query>(.*?)<\/image-query>/gs, "$1").trim());
    const imageCaptions = imageCaptionTags ? imageCaptionTags.map((caption) => caption.replace(/<image-caption>(.*?)<\/image-caption>/gs, "$1").trim()) : [];

    return { imageSearchQueries, imageCaptions, blogPost };
  }
});

const imageSearchStep = createStep({
  id: "image-search-step",
  description: "Search for images for a blog post",
  inputSchema: z.object({
    imageSearchQueries: z.array(z.string()),
    imageCaptions: z.array(z.string()),
    blogPost: z.string()
  }),
  outputSchema: z.object({
    images: z.array(z.string()),
    imageCaptions: z.array(z.string()),
    blogPost: z.string()
  }),
  execute: async ({ inputData }) => {
    const { imageSearchQueries, imageCaptions, blogPost } = inputData;
    let foundImages: string[] = [];
    for (const query of imageSearchQueries) {
      const searchResults = await imageSearch(query);
      foundImages.push(...searchResults);
    }

    return {
      images: foundImages,
      imageCaptions,
      blogPost
    };
  }
});

const injectImagesStep = createStep({
  id: "inject-images-step",
  description: "Inject actual images into the blog post, replacing image blocks with markdown format",
  inputSchema: z.object({
    images: z.array(z.string()),
    imageCaptions: z.array(z.string()),
    blogPost: z.string()
  }),
  outputSchema: z.object({
    blogPost: z.string(),
    images: z.array(z.string())
  }),
  execute: async ({ inputData }) => {
    const { images, imageCaptions, blogPost } = inputData;
    
    let finalBlogPost = blogPost;
    let imageIndex = 0;
    
    // Replace each complete <image> block with markdown format
    finalBlogPost = finalBlogPost.replace(/<image>\s*<image-query>.*?<\/image-query>\s*<image-caption>.*?<\/image-caption>\s*<\/image>/gs, () => {
      if (imageIndex < images.length) {
        const imageUrl = images[imageIndex];
        const caption = imageIndex < imageCaptions.length ? imageCaptions[imageIndex] : '';
        imageIndex++;
        
        // Format as: ![](image_url)\n*caption*
        return `![](${imageUrl})\n*${caption}*`;
      }
      return ''; // Remove tag if no image available
    });
    
    // Extract the blog content from <blog> tags if present
    const blogMatch = finalBlogPost.match(/<blog>(.*?)<\/blog>/s);
    if (blogMatch) {
      finalBlogPost = blogMatch[1].trim();
    }
    
    return {
      blogPost: finalBlogPost,
      images
    };
  }
});

export const blogImageWorkflow = createWorkflow({
    id: "blog-image-workflow",
    description: "Add images to a blog post by searching for relevant images and injecting them",
    inputSchema: z.object({
        blogPost: z.string(),
        title: z.string()
    }),
    outputSchema: z.object({
        blogPost: z.string(),
        images: z.array(z.string())
    }),
})  .then(blogImagePlaceholderStep)
    .then(extractImageQueriesStep)      
    .then(imageSearchStep)
    .then(injectImagesStep)
    .commit();