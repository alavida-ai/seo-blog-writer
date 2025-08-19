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
 * @param seoData SEO data including keywords and targeting information
 * @returns Promise that resolves with the full path of the created blog post
 */
export async function writeBlogPost(
  filename: string,
  content: string,
  title: string,
  seoData?: {
    primaryKeyword: {
      keyword: string;
      searchVolume: number;
      difficulty: number;
      intent: 'informational' | 'commercial' | 'transactional' | 'navigational';
    };
    secondaryKeywords: Array<{
      keyword: string;
      searchVolume: number;
      relevance: 'high' | 'medium' | 'low';
    }>;
    contentAngle: string;
    estimatedTrafficPotential: number;
  }
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
  let frontmatter = `---
title: "${title}"
date: ${new Date().toISOString().split('T')[0]}
draft: false`;

  // Add SEO metadata if provided
  if (seoData) {
    const keywords = [
      seoData.primaryKeyword.keyword,
      ...seoData.secondaryKeywords.map(k => k.keyword)
    ];
    
    frontmatter += `
keywords: ${JSON.stringify(keywords)}
seo:
  primaryKeyword: "${seoData.primaryKeyword.keyword}"
  searchVolume: ${seoData.primaryKeyword.searchVolume}
  difficulty: ${seoData.primaryKeyword.difficulty}
  intent: "${seoData.primaryKeyword.intent}"
  contentAngle: "${seoData.contentAngle}"
  estimatedTrafficPotential: ${seoData.estimatedTrafficPotential}
targeting:
  secondaryKeywords:`;
    
    seoData.secondaryKeywords.forEach(keyword => {
      frontmatter += `
    - keyword: "${keyword.keyword}"
      searchVolume: ${keyword.searchVolume}
      relevance: "${keyword.relevance}"`;
    });
  }

  frontmatter += `
---

`;

  const fullContent = frontmatter + content;

  await fs.writeFile(outputPath, fullContent, "utf8");

  return outputPath;
}
