import { appName } from "../config";

export default function help() {
  console.log(`
Usage: ${appName} <command>

Commands:
  help  :  Show help information about the commands 
  cwd  :  to show the path of current location
  deploy  :  to deploy canisters on mainnet
  new <projectName>  :  to create new ICP project
  redeem <toPrincipalId> <couponId>  :  to redeem the coupon in any identity through the principal id 
  cycles-balance [PrincipalId]  :  to check the cycles balance of any identity through the principal id 
  new-identity <identityName>  :  to create new ICP identity
  identity-get-principal  :  to get the principal of any identity  
  identity-use <identityName>  :  to use any identity through it's name 
  For more information, use '${appName} <command> --help'.
  `);
};
