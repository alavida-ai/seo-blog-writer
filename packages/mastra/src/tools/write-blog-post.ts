import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { RuntimeContext } from "@mastra/core/di";
import { blogWritingWorkflow } from "../workflows/blog-writing-workflow";
import { RepoRuntimeContext } from "../constants";
import { slackNotificationOutputSchema } from "../workflows/blog-writing-workflow";
import { existsSync } from "fs";
import { join, dirname } from "path";
import { execSync } from "child_process";

/**
 * Find the git repository root directory or fall back to project root
 */
function findProjectRoot(): string {
    try {
        // Try to find git root first
        const gitRoot = execSync('git rev-parse --show-toplevel', { 
            encoding: 'utf8',
            stdio: 'pipe'
        }).trim();
        return gitRoot;
    } catch {
        // Fall back to MASTRA_PROJECT_ROOT or current working directory
        return process.env.MASTRA_PROJECT_ROOT || process.cwd();
    }
}

export const writeBlogPostTool = createTool({
    id: "write-blog-post-tool",
    description: `Writes a blog post with repository-aware context. 
    
    This tool will:
    - Research SEO keywords for the topic
    - Analyze competitive landscape 
    - Generate comprehensive blog content
    - Create properly formatted markdown with frontmatter
    - Create a GitHub pull request
    - Send Slack notification`,
    inputSchema: z.object({
        topic: z.string().describe("The topic of the blog post that you wish to write about or target for SEO purposes"),
        brand: z.string().describe("The brand that you wish to publish the blog post for"),
        owner: z.string().describe("GitHub repository owner (e.g., 'alavida-ai')"),
        repo: z.string().describe("GitHub repository name (e.g., 'seo-blog-writer')"),
        contentPath: z.string().describe("Path to content directory where blog posts should be written (e.g., './apps/docs/content/blogs/')"),
        projectRoot: z.string().optional().describe("Optional: Path to project root directory containing .vibeflow (defaults to git root or current directory)"),
    }),
    outputSchema: z.object({
        title: z.string().describe("The title of the blog post"),
        filePath: z.string().describe("The file path of the blog post")
    }),
    execute: async ({ context, mastra, runtimeContext }) => {
    const { topic, brand, owner, repo, contentPath, projectRoot: userProjectRoot } = context;
    
    // Validate .vibeflow directory and brand fundamentals exist
    const projectRoot = userProjectRoot || findProjectRoot();
    const vibeflowDir = join(projectRoot, '.vibeflow');
    const strategyDir = join(vibeflowDir, 'strategy');
    const brandFundamentalsPath = join(strategyDir, 'brandFundamentals.md');
    
    console.log(`🔍 Checking project structure in: ${projectRoot}...`);
    
    if (!existsSync(vibeflowDir)) {
        throw new Error(`❌ Project not initialized. Please run 'vibeflow init' to set up the project structure.\n\nMissing: .vibeflow directory`);
    }
    
    if (!existsSync(strategyDir)) {
        throw new Error(`❌ Strategy directory missing. Please run 'vibeflow init' to set up the project structure.\n\nMissing: .vibeflow/strategy directory`);
    }
    
    if (!existsSync(brandFundamentalsPath)) {
        throw new Error(`❌ Brand fundamentals file missing. Please run 'vibeflow init' to create the template.\n\nMissing: .vibeflow/strategy/brandFundamentals.md\n\nThis file should contain your brand strategy, positioning, and key messaging.`);
    }
    
    console.log(`✅ Project structure validated`);
    
    // Set repository context into runtime context
    runtimeContext?.set("repo-owner", owner);
    runtimeContext?.set("repo-name", repo);
    runtimeContext?.set("content-path", contentPath);
    
    console.log(`🚀 Starting blog post generation for: ${topic}`);
    console.log(`📍 Repository: ${owner}/${repo}`);
    console.log(`📁 Content path: ${contentPath}`);
    
    const run = await blogWritingWorkflow.createRunAsync({});

    const runResult = await run!.start({
        inputData: {
            topic: topic,
            brand: brand
        },
        runtimeContext: runtimeContext
    });

    console.log('🔍 Run result structure:', JSON.stringify(runResult, null, 2));
    
    // Extract the values from the workflow result
    // The workflow returns the final step output directly
    const { title, filePath } = (runResult as any).result;
    
    // Handle different possible result structures
    

    return {
        title: title,
        filePath: filePath
    };
    }
});