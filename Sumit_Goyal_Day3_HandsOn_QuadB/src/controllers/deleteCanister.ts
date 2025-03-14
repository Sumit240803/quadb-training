import { ICManagementCanister } from "@dfinity/ic-management";
import { Principal } from "@dfinity/principal";
import { createAgent } from "../commands/allCanisters";

export const deleteCanister = async (canistersId: string)=>{
    try {
        const agent = await createAgent();
        const managementCanister = ICManagementCanister.create({ agent });
        const canisterId: Principal = Principal.fromText(canistersId);

        let result: any = await managementCanister.deleteCanister(canisterId);
        console.log("result : ",result)
        if (!result || undefined) {
            console.log("Canister deleted successfully.")
        }
    } catch (error: any) {
        if (error?.props) {
            console.log("Error : ", error?.props);
        } else {
            console.log(error);
        }
    }
}