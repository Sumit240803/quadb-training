import { redeemFaucetCoupon } from "./RedeemCoupon";
import { Principal } from "@dfinity/principal";
import { getIdentity } from "../canisterActor/authClient";


export const faucerCoupon = async (toPrincipalId: string, couponId: string) => {
   const identity = getIdentity();
    const faucetPrincipal: Principal = Principal.fromUint8Array(new Uint8Array([0, 0, 0, 0, 1, 112, 0, 196, 1, 1]));
    try {
        const toSubaccount = Principal.fromText(toPrincipalId);
        const result = await redeemFaucetCoupon(couponId,toSubaccount,faucetPrincipal, identity);
        console.log("result : ",result);
    } catch (error: any) {
        if (error?.props) {
            console.log("Error redeem coupon : ",error?.props);
        }else{
            console.log(error);
        }
    }
}