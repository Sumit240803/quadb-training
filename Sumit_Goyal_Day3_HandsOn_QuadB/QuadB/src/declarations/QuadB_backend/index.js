import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "./QuadB_backend.did.js";
export { idlFactory } from "./QuadB_backend.did.js";

export const QuadB_backend = async (options = {}) => {
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