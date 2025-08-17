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
    const prompt = `Your job is to rewrite this blog post exactly as is however you will identify 2-3 locations within the blog post where we can add an image. To enhance the readibility of the blog post. 
    Do not change anything in the blog post. Simply inject in the relevant locations the query for the images in the following format: 

    <image-query> 
    The query for the image. 
    </image-query>

    Here is the blog post, don't change anything in the blog post: ${blogPost}

    Output the blog post in the <blog> tag.

    Example:
    <blog>
    This is the blog post.
    <image-query>
    The query for the image.
    </image-query>
    More text. 
    </blog>
    `

    const response = await contentWriterAgent.generate(prompt);

    const blogPostWithQueries = response.text;

    return { blogPost: blogPostWithQueries };
  }
});

const extractImageQueriesStep = createStep({
  id: "extract-image-queries-step",
  description: "Extract image queries from a blog post",
  inputSchema: z.object({
    blogPost: z.string()
  }),
  outputSchema: z.object({
    imageSearchQueries: z.array(z.string()),
    blogPost: z.string()
  }),
  execute: async ({ inputData }) => {
    const { blogPost } = inputData;

    const imageTagQueries = blogPost.match(/<image-query>(.*?)<\/image-query>/gs);

    if (!imageTagQueries) {
      throw new Error("No image tag queries found");
    }

    const imageSearchQueries = imageTagQueries.map((query) => query.replace(/<image-query>(.*?)<\/image-query>/gs, "$1").trim());

    return { imageSearchQueries, blogPost };
  }
});

const imageSearchStep = createStep({
  id: "image-search-step",
  description: "Search for images for a blog post",
  inputSchema: z.object({
    imageSearchQueries: z.array(z.string()),
    blogPost: z.string()
  }),
  outputSchema: z.object({
    images: z.array(z.string()),
    blogPost: z.string()
  }),
  execute: async ({ inputData }) => {
    const { imageSearchQueries, blogPost } = inputData;
    let foundImages: string[] = [];
    for (const query of imageSearchQueries) {
      const searchResults = await imageSearch(query);
      foundImages.push(...searchResults);
    }

    return {
      images: foundImages,
      blogPost
    };
  }
});

const injectImagesStep = createStep({
  id: "inject-images-step",
  description: "Inject actual images into the blog post, replacing image query tags",
  inputSchema: z.object({
    images: z.array(z.string()),
    blogPost: z.string()
  }),
  outputSchema: z.object({
    blogPost: z.string(),
    images: z.array(z.string())
  }),
  execute: async ({ inputData }) => {
    const { images, blogPost } = inputData;
    
    let finalBlogPost = blogPost;
    let imageIndex = 0;
    
    // Replace each <image-query> tag with the corresponding actual image
    finalBlogPost = finalBlogPost.replace(/<image-query>(.*?)<\/image-query>/gs, () => {
      if (imageIndex < images.length) {
        return images[imageIndex++];
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