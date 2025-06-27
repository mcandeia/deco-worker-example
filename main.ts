import { DefaultEnv, withRuntime } from "@deco/workers-runtime";
import { Env as EnvGen } from "./env.gen.ts";

export type Env = EnvGen & DefaultEnv;

export default withRuntime<Env>({
  async fetch(_req: Request, env: Env) {
    return Response.json(await env.SLACK.LIST_CHANNELS({}));
  },
});
