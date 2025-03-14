import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

export const listAllIdentities = async (): Promise<string[]> => {
  try {
    const identityConfigPath = path.join(os.homedir(), '.config', 'dfx', 'identity.json');
    let currentIdentityName: string | null = null;
    try {
      const configData = await fs.readFile(identityConfigPath, 'utf8');
      const configJson = JSON.parse(configData);
      currentIdentityName = configJson.default;
    } catch (configError) {
      console.warn('No default identity config found.');
    }

    const identitiesDir: string = path.join(os.homedir(), '.config', 'dfx', 'identity');
    const identityNames: string[] = await fs.readdir(identitiesDir);
    const identities: string[] = [];

    for (const identityName of identityNames) {
      const identityPath = path.join(identitiesDir, identityName);
      try {
        const stat = await fs.stat(identityPath);
        if (!stat.isDirectory()) {
          continue;
        }

        const pemPath: string = path.join(identityPath, 'identity.pem');
        try {
          await fs.access(pemPath);
        } catch (accessError) {
          continue;
        }

        const displayName = identityName === currentIdentityName
          ? `* ${identityName}`
          : identityName;
        identities.push(displayName);
      } catch (innerError) {
        console.error(`Error processing identity "${identityName}":`, innerError);
      }
    }

    console.log('List of identities:', identities);
    return identities;
  } catch (error) {
    console.error('❌ Error listing all identities:', error);
    return [];
  }
};
