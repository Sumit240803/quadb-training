import { ICManagementCanister } from "@dfinity/ic-management";
import { Principal } from "@dfinity/principal";
import { createAgent } from "../commands/allCanisters";

export const createCanisterControllers = async (canistersId: string, newControllerId: string) => {
    try {
        const agent = await createAgent();
        const managementCanister = ICManagementCanister.create({ agent });
        const canisterId: Principal = Principal.fromText(canistersId);
        const status: any = await managementCanister.canisterStatus(canisterId);
        let currentControllers: string[] = status.settings.controllers.map((c: { toString: () => string; }) => c.toString());

        if (!currentControllers.includes(newControllerId)) {
            currentControllers.push(newControllerId);
        }

        const updatedControllers: string[] = currentControllers.map(controller => controller);

        console.log("new controllers:", updatedControllers);

        let result: any = await managementCanister.updateSettings({
            canisterId: Principal.fromText(canistersId),
            settings: {
                controllers: updatedControllers,
                freezingThreshold: BigInt(0),
                memoryAllocation: BigInt(0),
                computeAllocation: BigInt(0),
                reservedCyclesLimit: BigInt(0),
                logVisibility: undefined,
                wasmMemoryLimit: BigInt(0),
            },
        });
        if (!result || undefined) {
            console.log("A new controller has been successfully added.")
        }
    } catch (error: any) {
        if (error?.props) {
            console.log("Error : ", error?.props);
        } else {
            console.log(error);
        }
    }
}

export const listCanisterControllers = async (canistersId: string) => {
    try {
        const agent = await createAgent();
        const managementCanister: any = ICManagementCanister.create({ agent });
        const canisterId: Principal = Principal.fromText(canistersId);
        const status: any = await managementCanister.canisterStatus(canisterId);
        console.log("Current controllers:", status.settings.controllers.map((c: { toString: () => any; }) => c.toString()));
    } catch (error: any) {
        if (error?.props) {
            console.log("Error : ", error?.props);
        } else {
            console.log(error);
        }
    }
}

export const canisterStatus = async (canistersId: string) => {
    try {
        const agent = await createAgent();
        const managementCanister: any = ICManagementCanister.create({ agent });
        const canisterId: Principal = Principal.fromText(canistersId);
        const status: any = await managementCanister.canisterStatus(canisterId);
        console.log(status)
    } catch (error: any) {
        if (error?.props) {
            console.log("Error : ", error?.props);
        } else {
            console.log(error);
        }
    }
}