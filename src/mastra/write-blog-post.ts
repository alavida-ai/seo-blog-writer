import { mastra } from ".";

const workflow = mastra!.getWorkflow("blogResearchWorkflow");

const run = await workflow.createRunAsync({});

const runResult = await run.start({
  inputData: {
    topic: "cross-border payments",
    brand: "send.it"
  }
}); 

console.log(runResult);