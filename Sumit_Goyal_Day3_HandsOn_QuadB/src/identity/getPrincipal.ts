import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { Secp256k1KeyIdentity } from "@dfinity/identity-secp256k1";
import { Principal } from '@dfinity/principal';


export const getCurrentPrincipal = async () => {
    try {
        const identityConfigPath : string= path.join(os.homedir(), '.config', 'dfx', 'identity.json');
        const identityConfig = JSON.parse(await fs.readFile(identityConfigPath, 'utf8'));
        const identityName : string= identityConfig.default;
        
        if (!identityName) {
            throw new Error("No identity is currently set.");
        }

        console.log(`identity : ${identityName}`);

        const pemPath : string = path.join(os.homedir(), '.config', 'dfx', 'identity', identityName, 'identity.pem');
        const privateKeyPem : string = await fs.readFile(pemPath, 'utf8');

        const identity : Secp256k1KeyIdentity= Secp256k1KeyIdentity.fromPem(privateKeyPem);

        const principal : Principal = identity.getPrincipal();
        console.log("principal : ", principal.toText());
        return principal;
    } catch (error) {
        console.error('❌ Error getting current principal:', error);
        return null;
    }
};