import { Principal } from '@dfinity/principal';
const { Actor, HttpAgent } = require('@dfinity/agent');
import fs from 'fs/promises';
import { existsSync } from 'fs';
import { generateKeyPairSync } from 'crypto';
import path from 'path';
import os from 'os';
import { createPrivateKey } from 'crypto';
import { Secp256k1KeyIdentity } from '@dfinity/identity-secp256k1';
import { idlFactory } from '../res/canisterActoridlFactory';


export async function getIdentity() {
    try {
        const identityConfigPath = path.join(os.homedir(), '.config', 'dfx', 'identity.json');
        const identityConfig = JSON.parse(await fs.readFile(identityConfigPath, 'utf8'));
        const identityName = identityConfig.default;
        if (!identityName) {
            throw new Error("No identity is currently set.");
        }
        const pemPath = path.join(os.homedir(), '.config', 'dfx', 'identity', identityName, 'identity.pem');
        const privateKeyPem = await fs.readFile(pemPath, 'utf8');
        const identity = Secp256k1KeyIdentity.fromPem(privateKeyPem);
        return identity;
    } catch (error) {
        console.log(error)
    }
}

export const createCanisterActor = async () => {
    const identity = getIdentity();
    const canisterId = Principal.fromText("lpa4d-iqaaa-aaaah-aq7ja-cai");
    const host = "https://ic0.app";
    try {
        let agent = new HttpAgent({ identity, host });
        return Actor.createActor(idlFactory, { agent, canisterId });
    } catch (err) {
        console.error("Error creating actor:", err);
    }
};