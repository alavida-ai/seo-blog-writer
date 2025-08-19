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
 * Generates a meta description from blog content
 * @param content Blog post content
 * @param maxLength Maximum length for the description (default: 160)
 * @returns Generated meta description
 */
function generateMetaDescription(content: string, maxLength: number = 160): string {
  // Remove markdown formatting and HTML tags
  const cleanContent = content
    .replace(/#{1,6}\s+/g, '') // Remove markdown headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold formatting
    .replace(/\*(.*?)\*/g, '$1') // Remove italic formatting
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links, keep text
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`(.*?)`/g, '$1') // Remove inline code
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim();

  // Extract first meaningful paragraph (skip very short sentences)
  const sentences = cleanContent.split(/[.!?]+/).filter(s => s.trim().length > 20);
  let description = sentences[0]?.trim() || '';

  // If first sentence is too short, add the second one
  if (description.length < 80 && sentences[1]) {
    description += '. ' + sentences[1].trim();
  }

  // Truncate to maxLength while keeping complete words
  if (description.length > maxLength) {
    description = description.substring(0, maxLength);
    const lastSpace = description.lastIndexOf(' ');
    if (lastSpace > 0) {
      description = description.substring(0, lastSpace);
    }
    description += '...';
  }

  return description || 'Discover insights and actionable strategies in this comprehensive guide.';
}

/**
 * Extracts the first image URL from blog content
 * @param content Blog post content
 * @returns First image URL found, or null if none found
 */
function extractFeaturedImage(content: string): string | null {
  // Look for markdown images: ![alt](url) 
  const markdownImageMatch = content.match(/!\[.*?\]\((https?:\/\/[^\s)]+)\)/);
  if (markdownImageMatch) {
    return markdownImageMatch[1];
  }

  // Look for HTML images: <img src="url">
  const htmlImageMatch = content.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/);
  if (htmlImageMatch) {
    return htmlImageMatch[1];
  }

  return null;
}

/**
 * Writes a blog post to the docs/content/blogs directory with comprehensive SEO metadata
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
  },
  contentPath?: string
): Promise<string> {
  const baseFilename =
    filename.endsWith(".md") || filename.endsWith(".txt")
      ? filename.substring(0, filename.lastIndexOf("."))
      : filename;

  // Create content directory (use provided path or fallback to default)
  const defaultContentPath = "docs/content/blogs";
  const resolvedContentPath = contentPath || defaultContentPath;
  const blogsDir = path.resolve(process.cwd(), resolvedContentPath);
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

  // Generate SEO metadata
  const metaDescription = generateMetaDescription(content);
  const featuredImage = extractFeaturedImage(content);
  const publishDate = new Date().toISOString();
  const slug = uniqueFilename.replace('.md', '');
  
  // Create comprehensive frontmatter
  let frontmatter = `---
title: "${title}"
description: "${metaDescription}"
date: ${publishDate.split('T')[0]}
publishedAt: ${publishDate}
slug: "${slug}"
draft: false
author:
  name: "Send.it Team"
  url: "https://send.it"
  image: "https://send.it/logo.png"`;

  // Add featured image if found
  if (featuredImage) {
    frontmatter += `
image: "${featuredImage}"
featuredImage:
  url: "${featuredImage}"
  alt: "${title}"
  width: 1200
  height: 630`;
  }

  // Add SEO metadata if provided
  if (seoData) {
    const keywords = [
      seoData.primaryKeyword.keyword,
      ...seoData.secondaryKeywords.map(k => k.keyword)
    ];
    
    frontmatter += `
keywords: ${JSON.stringify(keywords)}
seo:
  title: "${title}"
  description: "${metaDescription}"
  keywords: ${JSON.stringify(keywords)}
  primaryKeyword: "${seoData.primaryKeyword.keyword}"
  searchVolume: ${seoData.primaryKeyword.searchVolume}
  difficulty: ${seoData.primaryKeyword.difficulty}
  intent: "${seoData.primaryKeyword.intent}"
  contentAngle: "${seoData.contentAngle}"
  estimatedTrafficPotential: ${seoData.estimatedTrafficPotential}
  canonical: "https://send.it/blog/${slug}"
openGraph:
  title: "${title}"
  description: "${metaDescription}"
  type: "article"
  url: "https://send.it/blog/${slug}"
  siteName: "Send.it Blog"
  locale: "en_US"`;

    if (featuredImage) {
      frontmatter += `
  images:
    - url: "${featuredImage}"
      width: 1200
      height: 630
      alt: "${title}"`;
    }

    frontmatter += `
twitter:
  card: "summary_large_image"
  site: "@senditapp"
  creator: "@senditapp"
  title: "${title}"
  description: "${metaDescription}"`;

    if (featuredImage) {
      frontmatter += `
  image: "${featuredImage}"`;
    }

    frontmatter += `
article:
  publishedTime: ${publishDate}
  modifiedTime: ${publishDate}
  author: "Send.it Team"
  section: "Technology"
  tags: ${JSON.stringify(keywords)}
schema:
  type: "BlogPosting"
  headline: "${title}"
  description: "${metaDescription}"
  datePublished: ${publishDate}
  dateModified: ${publishDate}
  author:
    type: "Organization"
    name: "Send.it"
    url: "https://send.it"
  publisher:
    type: "Organization"
    name: "Send.it"
    url: "https://send.it"
    logo: "https://send.it/logo.png"
  mainEntityOfPage: "https://send.it/blog/${slug}"`;

    if (featuredImage) {
      frontmatter += `
  image: "${featuredImage}"`;
    }

    frontmatter += `
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
