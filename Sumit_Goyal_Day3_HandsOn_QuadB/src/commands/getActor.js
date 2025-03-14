import { idlFactory as frontendIdlFactory } from "../res/npmpackage_frontend.did";
import { Actor } from "@dfinity/agent";


export default async function getActor(agent, canister) {
  try {
    const FrontendCanisterActor = Actor.createActor(frontendIdlFactory, {
      agent,
      canisterId: canister,
    });

    return FrontendCanisterActor;
  } catch (error) {
    throw error;
  }
}