import { mastra } from ".";
import fs from 'fs';
import path from 'path';

async function testImageGeneration() {
  console.log("🧪 Testing image generation on existing blog post...");
  
  // Read the existing blog post
  const blogPath = path.join(process.cwd(), 'docs/content/blogs/cross-border-payments-revolution-how-blockchain-technology-is-eliminating-traditional-transfer-barriers.md');
  const existingContent = fs.readFileSync(blogPath, 'utf-8');
  
  // Extract just the content (skip frontmatter)
  const contentMatch = existingContent.match(/---[\s\S]*?---\n([\s\S]*)/);
  const blogContent = contentMatch ? contentMatch[1] : existingContent;
  
  console.log("📄 Original blog content length:", blogContent.length);
  
  try {
    // Get the image workflow
    const imageWorkflow = mastra.getWorkflow("blogImageWorkflow");
    
    if (!imageWorkflow) {
      throw new Error("Blog image workflow not found");
    }
    
    console.log("🔍 Running image workflow...");
    
    // Run the image workflow
    const run = await imageWorkflow.createRunAsync({});
    const result = await run.start({
      inputData: {
        blogPost: blogContent,
        title: "Cross-Border Payments Revolution: How Blockchain Technology Is Eliminating Traditional Transfer Barriers"
      }
    });
    
    const { blogPost: contentWithImages } = (result as any).result;
    
    console.log("✅ Image workflow completed!");
    console.log("📄 Content with images length:", contentWithImages.length);
    
    // Count images in result
    const imageCount = (contentWithImages.match(/!\[\]/g) || []).length;
    console.log(`🖼️ Images added: ${imageCount}`);
    
    if (imageCount > 0) {
      console.log("🎉 SUCCESS: Images were successfully added to the blog post!");
      
      // Write test result to a file
      const testOutputPath = path.join(process.cwd(), 'test-output-with-images.md');
      fs.writeFileSync(testOutputPath, contentWithImages);
      console.log(`📝 Test output written to: ${testOutputPath}`);
    } else {
      console.log("⚠️ WARNING: No images were added to the blog post");
    }
    
  } catch (error) {
    console.error("❌ Error during image generation test:", error);
  }
}

testImageGeneration().catch(console.error);
