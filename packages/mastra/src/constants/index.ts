export * from "./models";

// Runtime Context Types
export type RepoRuntimeContext = {
  "repo-owner": string;
  "repo-name": string;
  "current-branch": string;
  "content-path": string;
  "frontmatter-has-complex-seo": boolean;
  "frontmatter-has-targeting": boolean;
  "frontmatter-sample": string;
  "filename-uses-long-names": boolean;
  "filename-uses-dashes": boolean;
  "filename-sample": string;
};