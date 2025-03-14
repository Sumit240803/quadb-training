import { ICManagementCanister } from "@dfinity/ic-management";
import { Principal } from "@dfinity/principal";
import { createAgent } from "../commands/allCanisters";

export const stopCanister = async (canistersId: string)=>{
    try {
        const agent = await createAgent();
        const managementCanister = ICManagementCanister.create({ agent });
        const canisterId: Principal = Principal.fromText(canistersId);

        let result: any = await managementCanister.stopCanister(canisterId);
        if (!result || undefined) {
            console.log("Canister stop successfully.")
        }
    } catch (error: any) {
        if (error?.props) {
            console.log("Error : ", error?.props);
        } else {
            console.log(error);
        }
    }
}
