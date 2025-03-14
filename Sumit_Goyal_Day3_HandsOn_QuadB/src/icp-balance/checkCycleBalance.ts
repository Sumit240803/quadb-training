import { Principal } from "@dfinity/principal";
import { Actor, HttpAgent, toHex } from "@dfinity/agent";
import { idlFactory } from "../res/cyclesIdlFactory";

export async function checkCyclesBalance(
  userPrincipalId: Principal,
  canisterId: Principal,
  identity: any
) {
  try {
    const agent = new HttpAgent({ identity });
    const CouponActor = Actor.createActor(idlFactory, { agent, canisterId });
    const result = await CouponActor?.icrc1_balance_of({
        owner: userPrincipalId,
        subaccount: []
      });
    return result; 
  } catch (error) {
    console.error("Error checking cyles:", error);
    throw error;
  }
}
