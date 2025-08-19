import { Octokit } from "@octokit/rest";
import { createTool } from "@mastra/core";
import { z } from "zod";

// Direct function for use in workflows
export const createGitHubPullRequest = async (params: {
  owner: string;
  repo: string;
  title: string;
  content: string;
  filename: string;
  baseBranch?: string;
  githubToken: string;
}) => {
  const { owner, repo, title, content, filename, baseBranch = "main", githubToken } = params;
  
  const octokit = new Octokit({
    auth: githubToken,
  });

  // Create a unique branch name based on the filename and timestamp
  const timestamp = Date.now();
  const sanitizedFilename = filename.replace(/\.md$/, '').replace(/[^a-zA-Z0-9-]/g, '-');
  const branchName = `blog/${sanitizedFilename}-${timestamp}`;

  try {
    // Get the latest commit SHA from the base branch
    const { data: baseRef } = await octokit.rest.git.getRef({
      owner,
      repo,
      ref: `heads/${baseBranch}`,
    });

    // Create a new branch
    await octokit.rest.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${branchName}`,
      sha: baseRef.object.sha,
    });

    // Create the blog post file in the new branch
    const filePath = `apps/docs/content/blogs/${filename}`;
    await octokit.rest.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: filePath,
      message: `Add blog post: ${title}`,
      content: Buffer.from(content).toString('base64'),
      branch: branchName,
    });

    // Create the pull request
    const { data: pullRequest } = await octokit.rest.pulls.create({
      owner,
      repo,
      title: `Add blog post: ${title}`,
      head: branchName,
      base: baseBranch,
      body: `This PR adds a new blog post: "${title}"\n\nGenerated automatically by the blog writing workflow.`,
    });

    // Generate the file URL
    const fileUrl = `https://github.com/${owner}/${repo}/blob/${branchName}/${filePath}`;

    return {
      pullRequestUrl: pullRequest.html_url,
      branchName,
      pullRequestNumber: pullRequest.number,
      fileUrl,
    };
  } catch (error) {
    throw new Error(`Failed to create pull request: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

const createPullRequestSchema = z.object({
  owner: z.string().describe("Repository owner"),
  repo: z.string().describe("Repository name"),
  title: z.string().describe("Blog post title"),
  content: z.string().describe("Blog post content with frontmatter"),
  filename: z.string().describe("Blog post filename"),
  baseBranch: z.string().default("main").describe("Base branch to create PR against"),
  githubToken: z.string().describe("GitHub personal access token"),
});

export const createPullRequestTool = createTool({
  id: "createPullRequest",
  description: "Creates a pull request with a new blog post",
  inputSchema: createPullRequestSchema,
  outputSchema: z.object({
    pullRequestUrl: z.string().describe("URL of the created pull request"),
    branchName: z.string().describe("Name of the created branch"),
    pullRequestNumber: z.number().describe("Pull request number"),
    fileUrl: z.string().describe("URL to the file in the repository"),
  }),
  execute: async ({ context }) => {
    const { owner, repo, title, content, filename, baseBranch, githubToken } = context;
    
    const octokit = new Octokit({
      auth: githubToken,
    });

    // Create a unique branch name based on the filename and timestamp
    const timestamp = Date.now();
    const sanitizedFilename = filename.replace(/\.md$/, '').replace(/[^a-zA-Z0-9-]/g, '-');
    const branchName = `blog/${sanitizedFilename}-${timestamp}`;

    try {
      // Get the latest commit SHA from the base branch
      const { data: baseRef } = await octokit.rest.git.getRef({
        owner,
        repo,
        ref: `heads/${baseBranch}`,
      });

      // Create a new branch
      await octokit.rest.git.createRef({
        owner,
        repo,
        ref: `refs/heads/${branchName}`,
        sha: baseRef.object.sha,
      });

      // Create the blog post file in the new branch
      const filePath = `apps/docs/content/blogs/${filename}`;
      await octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: filePath,
        message: `Add blog post: ${title}`,
        content: Buffer.from(content).toString('base64'),
        branch: branchName,
      });

      // Create the pull request
      const { data: pullRequest } = await octokit.rest.pulls.create({
        owner,
        repo,
        title: `Add blog post: ${title}`,
        head: branchName,
        base: baseBranch,
        body: `This PR adds a new blog post: "${title}"\n\nGenerated automatically by the blog writing workflow.`,
      });

      // Generate the file URL
      const fileUrl = `https://github.com/${owner}/${repo}/blob/${branchName}/${filePath}`;

      return {
        pullRequestUrl: pullRequest.html_url,
        branchName,
        pullRequestNumber: pullRequest.number,
        fileUrl,
      };
    } catch (error) {
      throw new Error(`Failed to create pull request: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
});

const mergePullRequestSchema = z.object({
  owner: z.string().describe("Repository owner"),
  repo: z.string().describe("Repository name"),
  pullRequestNumber: z.number().describe("Pull request number to merge"),
  githubToken: z.string().describe("GitHub personal access token"),
  commitTitle: z.string().optional().describe("Custom commit title for merge"),
  mergeMethod: z.enum(["merge", "squash", "rebase"]).default("squash").describe("Merge method"),
});

export const mergePullRequestTool = createTool({
  id: "mergePullRequest",
  description: "Merges a pull request",
  inputSchema: mergePullRequestSchema,
  outputSchema: z.object({
    merged: z.boolean().describe("Whether the PR was successfully merged"),
    mergeCommitSha: z.string().optional().describe("SHA of the merge commit"),
    message: z.string().describe("Status message"),
  }),
  execute: async ({ context }) => {
    const { owner, repo, pullRequestNumber, githubToken, commitTitle, mergeMethod } = context;
    
    const octokit = new Octokit({
      auth: githubToken,
    });

    try {
      const { data: mergeResult } = await octokit.rest.pulls.merge({
        owner,
        repo,
        pull_number: pullRequestNumber,
        commit_title: commitTitle,
        merge_method: mergeMethod,
      });

      return {
        merged: mergeResult.merged,
        mergeCommitSha: mergeResult.sha,
        message: mergeResult.message,
      };
    } catch (error) {
      throw new Error(`Failed to merge pull request: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
});

const getRepositoryInfoSchema = z.object({
  owner: z.string().describe("Repository owner"),
  repo: z.string().describe("Repository name"),
  githubToken: z.string().describe("GitHub personal access token"),
});

export const getRepositoryInfoTool = createTool({
  id: "getRepositoryInfo",
  description: "Gets repository information including default branch and clone URLs",
  inputSchema: getRepositoryInfoSchema,
  outputSchema: z.object({
    defaultBranch: z.string().describe("Default branch name"),
    cloneUrl: z.string().describe("HTTPS clone URL"),
    sshUrl: z.string().describe("SSH clone URL"),
    htmlUrl: z.string().describe("Repository web URL"),
    fullName: z.string().describe("Full repository name (owner/repo)"),
  }),
  execute: async ({ context }) => {
    const { owner, repo, githubToken } = context;
    
    const octokit = new Octokit({
      auth: githubToken,
    });

    try {
      const { data: repository } = await octokit.rest.repos.get({
        owner,
        repo,
      });

      return {
        defaultBranch: repository.default_branch,
        cloneUrl: repository.clone_url,
        sshUrl: repository.ssh_url,
        htmlUrl: repository.html_url,
        fullName: repository.full_name,
      };
    } catch (error) {
      throw new Error(`Failed to get repository info: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
});
