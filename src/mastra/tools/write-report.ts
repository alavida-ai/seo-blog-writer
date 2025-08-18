import * as fs from "fs/promises";
import * as path from "path";

/**
 * Creates a report file with a unique filename
 * @param filename Name of the file to create (without extension)
 * @param content Content to write to the file
 * @param format Either 'markdown' or 'text' to determine file extension
 * @param outputDir Custom output directory (defaults to 'reports')
 * @returns Promise that resolves with the full path of the created report
 */
export async function createReport(
  filename: string,
  content: string,
  format: "markdown" | "text" = "markdown",
  outputDir: string = "reports"
): Promise<string> {
  const extension = format === "markdown" ? ".md" : ".txt";

  const baseFilename =
    filename.endsWith(".md") || filename.endsWith(".txt")
      ? filename.substring(0, filename.lastIndexOf("."))
      : filename;

  const reportsDir = path.resolve(process.cwd(), outputDir);

  await fs.mkdir(reportsDir, { recursive: true });

  let counter = 0;
  let uniqueFilename = `${baseFilename}${extension}`;
  let outputPath = path.join(reportsDir, uniqueFilename);

  while (true) {
    try {
      await fs.stat(outputPath);

      counter++;
      uniqueFilename = `${baseFilename}-${counter}${extension}`;
      outputPath = path.join(reportsDir, uniqueFilename);
    } catch (error) {
      break;
    }
  }

  await fs.writeFile(outputPath, content, "utf8");

  return outputPath;
}

/**
 * Writes a blog post to the docs/content/blogs directory with proper frontmatter
 * @param filename Name of the file to create (without extension)
 * @param content Blog post content
 * @param title Blog post title for frontmatter
 * @returns Promise that resolves with the full path of the created blog post
 */
export async function writeBlogPost(
  filename: string,
  content: string,
  title: string
): Promise<string> {
  const baseFilename =
    filename.endsWith(".md") || filename.endsWith(".txt")
      ? filename.substring(0, filename.lastIndexOf("."))
      : filename;

  // Create docs/content/blogs directory
  const blogsDir = path.resolve(process.cwd(), "docs/content/blogs");
  await fs.mkdir(blogsDir, { recursive: true });

  let counter = 0;
  let uniqueFilename = `${baseFilename}.md`;
  let outputPath = path.join(blogsDir, uniqueFilename);

  // Check for existing files and add counter if needed
  while (true) {
    try {
      await fs.stat(outputPath);
      counter++;
      uniqueFilename = `${baseFilename}-${counter}.md`;
      outputPath = path.join(blogsDir, uniqueFilename);
    } catch (error) {
      break;
    }
  }

  // Create frontmatter and combine with content
  const frontmatter = `---
title: "${title}"
date: ${new Date().toISOString().split('T')[0]}
draft: false
---

`;

  const fullContent = frontmatter + content;

  await fs.writeFile(outputPath, fullContent, "utf8");

  return outputPath;
}
