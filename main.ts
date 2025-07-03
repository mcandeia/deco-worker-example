import { DefaultEnv, withRuntime } from "@deco/workers-runtime";
import { createStep, createWorkflow } from "@deco/workers-runtime/mastra";
import { z } from "zod";
import { Env as EnvGen } from "./env.gen.ts";

const step1 = createStep({
  execute: ({ inputData: { input } }) => {
    console.log("running");
    return Promise.resolve({
      output: input + 1,
    });
  },
  id: "sum",
  inputSchema: z.object({
    input: z.number(),
  }),
  outputSchema: z.object({
    output: z.number(),
  }),
});

const testWorkflow = () => createWorkflow({
  id: "test-workflow",
  description: "Test workflow",
  inputSchema: z.object({
    input: z.number(),
  }),
  outputSchema: z.object({
    output: z.number(),
  }),
})
  .then(step1)
  .commit();

export type Env = EnvGen & DefaultEnv;

const { Workflow, ...workerAPIs } = withRuntime<Env>({
  workflows: [testWorkflow],
});
export { Workflow };
export default workerAPIs;
