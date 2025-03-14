import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

export const useIdentity = async (identityName: string) => {
    try {
        const identityPath = path.join(os.homedir(), '.config', 'dfx', 'identity', identityName, 'identity.pem');
        await fs.access(identityPath);
        const identityConfigPath = path.join(os.homedir(), '.config', 'dfx', 'identity.json');
        await fs.writeFile(identityConfigPath, JSON.stringify({ default: identityName }, null, 2), { mode: 0o600 });

        console.log(`✅ Identity switched to "${identityName}"`);

    } catch (error) {
        console.error(`❌ Error: Identity "${identityName}" does not exist.`);
        return null;
    }
};
