import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../declarations/votingDApp_backend";


async function createActor(){
    const agent = new HttpAgent({host : "http:localhost:4943"});
    await agent.fetchRootKey();
    return Actor.createActor(idlFactory , {agent , canisterId : "aovwi-4maaa-aaaaa-qaagq-cai"});
}
export {createActor};