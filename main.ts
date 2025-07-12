import { DefaultEnv, withRuntime } from "@deco/workers-runtime";
import { createStep, createWorkflow } from "@deco/workers-runtime/mastra";
import { z } from "zod";
import { Env as EnvGen, StateSchema } from "./env.gen.ts";

const step1 = createStep({
  execute: async ({ runtimeContext }) => {
    const env = runtimeContext.get("env") as Env;
    const channels = await env.USER_SLACK.LIST_CHANNELS({})
    return channels;
  },
  id: "list_slack_channels",
  inputSchema: z.any(),
  outputSchema: z.any(),
});

const testWorkflow = () => createWorkflow({
  id: "test-workflow",
  description: "Test workflow",
  inputSchema: z.any(),
  outputSchema: z.any(),
})
  .then(step1)
  .commit();
export type Env = EnvGen & DefaultEnv<typeof StateSchema>;

const { Workflow, ...workerAPIs } = withRuntime<Env, typeof StateSchema>({
  oauth: {
    state: StateSchema,
  },
  workflows: [testWorkflow],
});
export { Workflow };
export default workerAPIs;
