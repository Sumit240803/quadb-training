import { Principal } from "@dfinity/principal";
import { checkCyclesBalance } from "./checkCycleBalance";
import { getCurrentPrincipal } from "../identity/getPrincipal";
import { getIdentity } from "../canisterActor/authClient";


export const checkUserCycleBalance = async (PrincipalId?: string) => {
    const identity = getIdentity();
    const faucetPrincipal: Principal =
        Principal.fromUint8Array(
            new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x02, 0x10, 0x00, 0x02, 0x01, 0x01]));
    try {
        if (!PrincipalId) {
            const principal = await getCurrentPrincipal();
            if (!principal) {
                throw new Error("Failed to retrieve current principal");
            }
            PrincipalId = principal.toText();
        }
        
        const userPrincipalId: Principal = Principal.fromText(PrincipalId);
        const result = await checkCyclesBalance(userPrincipalId, faucetPrincipal, identity);
        
        const trillion = 1_000_000_000_000n;

        const formattedResult = `${(Number(result) / Number(trillion)).toFixed(3)}`;
        console.log(formattedResult, "(trillion cycles).");
        return Number(result);

    } catch (error) {
        console.error('Failed to check balance : ', error);
    }
}