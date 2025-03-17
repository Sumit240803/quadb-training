import { Actor, HttpAgent } from "@dfinity/agent";
import {idlFactory } from "../../declarations/counter_backend"

async function createActor() {
    

    const agent = new HttpAgent({ host: "http://localhost:4943" });
    await agent.fetchRootKey();

    return Actor.createActor(idlFactory, {
        agent,
        canisterId : "bkyz2-fmaaa-aaaaa-qaaaq-cai"
    });
}

export {createActor};