import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "./agent_backend.did.js";
export { idlFactory } from "./agent_backend.did.js";

export const project_backend = async (options = {}) => {
  const canisterId = "";
  const agent = options.agent || new HttpAgent({ ...options.agentOptions });

  if (options.agent && options.agentOptions) {
    console.warn(
      "Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent."
    );
  }
  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...options.actorOptions,
  });
};