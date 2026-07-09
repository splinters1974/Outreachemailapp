import { json, MODEL } from "../shared/api-utils.mjs";

export default async () => {
  return json(200, {
    hasApiKey: Boolean(process.env.ANTHROPIC_API_KEY),
    passcodeRequired: Boolean(process.env.APP_PASSCODE),
    model: MODEL,
  });
};

export const config = { path: "/api/status" };
