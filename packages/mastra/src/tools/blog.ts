import path from "path";
import fs from "fs/promises";

export async function createBlog(
    title: string,
    content: string,
    format: "markdown" = "markdown"
  ): Promise<string> {
  
    const reportsDir = path.resolve(process.cwd(), "blogs");
  
    await fs.mkdir(reportsDir, { recursive: true });

    let outputPath = path.join(reportsDir, title + ".md");

    const blog = {
        title: title,
        content: content,
        format: format
    }
  
    while (true) {
      try {
        await fs.stat(outputPath);
  
        outputPath = path.join(reportsDir, title + ".md");
      } catch (error) {
        break;
      }
    }
  
    await fs.writeFile(outputPath, JSON.stringify(blog, null, 2), "utf8");
  
    return outputPath;
  }
  