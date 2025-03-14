import { generateKeyPairSync } from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { Principal } from '@dfinity/principal';

export const createUserIdentity = async (identityName: string) => {
    try {
        console.log(`Creating identity: ${identityName}`);

        const { publicKey, privateKey } = generateKeyPairSync('ec', {
            namedCurve: 'secp256k1',
            publicKeyEncoding: {
                type: 'spki',
                format: 'der'
            },
            privateKeyEncoding: {
                type: 'sec1',
                format: 'pem'
            }
        });

        const dfxIdentityPath = path.join(os.homedir(), '.config', 'dfx', 'identity', identityName);
        await fs.mkdir(dfxIdentityPath, { recursive: true });
        const pemPath = path.join(dfxIdentityPath, 'identity.pem');
        const jsonPath = path.join(dfxIdentityPath, 'identity.json');

        await fs.writeFile(pemPath, privateKey, { mode: 0o600 });
        const identityJsonContent = JSON.stringify(
        {
          hsm: null,
          encryption: null,
          keyring_identity_suffix: identityName,
        },
        null,
        2
      );
      await fs.writeFile(jsonPath, identityJsonContent, { mode: 0o600 });

      
        const principal : Principal = Principal.selfAuthenticating(publicKey);
        const identityConfigPath = path.join(os.homedir(), '.config', 'dfx', 'identity.json');
        await fs.writeFile(identityConfigPath, JSON.stringify({ default: identityName }, null, 2), { mode: 0o600 });

        console.log(`Principal ID: ${principal.toText()}`);

    } catch (error) {
        console.error('❌ Error creating identity:', error);
    }
};
