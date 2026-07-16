import { json, MODEL_GENERATE, MODEL_RESEARCH } from "../shared/api-utils.mjs";

export default async () => {
  return json(200, {
    hasApiKey: Boolean(process.env.ANTHROPIC_API_KEY),
    passcodeRequired: Boolean(process.env.APP_PASSCODE),
    generateModel: MODEL_GENERATE,
    researchModel: MODEL_RESEARCH,
  });
};

export const config = { path: "/api/status" };
