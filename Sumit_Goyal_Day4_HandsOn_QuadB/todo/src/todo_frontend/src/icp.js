import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../declarations/todo_backend";


async function createActor() {
    

    const agent = new HttpAgent({ host: "http://localhost:4943" });
    await agent.fetchRootKey();

    return Actor.createActor(idlFactory, {
        agent,
        canisterId : "asrmz-lmaaa-aaaaa-qaaeq-cai"
    });
}

export {createActor};