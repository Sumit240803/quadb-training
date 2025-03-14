import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { HttpAgent } from "@dfinity/agent";
import { ICManagementCanister, InstallMode } from "@dfinity/ic-management";
import { Principal } from "@dfinity/principal";
import { IDL } from "@dfinity/candid";
import getActor from "./getActor.js";
import { createCanisterActor, getIdentity } from "../canisterActor/authClient.js";
import { setCanisterId, transferCyclesToCanister } from "../validators/validators.js";
import { getCurrentPrincipal } from "../identity/getPrincipal.js";

const { execSync } = require("child_process");
dotenv.config();

interface CanisterDetail {
  name: string;
  category: string;
  wasmPath: string;
  type: String;
  frontendIdlFactoryPath?: any;
}

export const getCanisterDetails = async (): Promise<CanisterDetail[]> => {
  const dfxFilePath = path.resolve("dfx.json");

  try {
    if (!fs.existsSync(dfxFilePath)) {
      throw new Error(`dfx.json file not found at ${dfxFilePath}`);
    }

    const data = await fs.promises.readFile(dfxFilePath, "utf-8");
    const dfxConfig = JSON.parse(data);
    const canisters = dfxConfig.canisters || {};


    const assetstorageDid = path.resolve(__dirname, "../../src/res/assetstorage.did");


    if (!fs.existsSync(assetstorageDid)) {
      throw new Error(`assetstorage.did file not found: ${assetstorageDid}`);
    }

    const copyAssetStorageDid = (name: string) => {
      const targetPaths = [
        path.resolve(".dfx", "ic", "canisters", name, "assetstorage.did"),
        path.resolve("src", "declarations", name, "assetstorage.did"),
      ];

      targetPaths.forEach((targetPath) => {
        if (!fs.existsSync(targetPath)) {
          try {
            fs.mkdirSync(path.dirname(targetPath), { recursive: true });
            fs.copyFileSync(assetstorageDid, targetPath);
          } catch (err) {
            console.error(`Failed to copy assetstorage.did to ${targetPath}: ${err}`);
          }
        }
      });
    };

    const copyMotokoWasmFile = async (name: string) => {
      try {
        const backendDid = path.resolve(__dirname, "../../src/res/project_backend.did");
        const didFilePath = path.resolve("src", "declarations", name, `${name}.did`);
        if (!fs.existsSync(didFilePath)) {
          fs.mkdirSync(path.dirname(didFilePath), { recursive: true });
          fs.copyFileSync(backendDid, didFilePath);
        }
        const newDidFilePath =
        path.resolve(".dfx", "ic", "canisters", name, `${name}.did`);
        if (!fs.existsSync(newDidFilePath)) {
          fs.mkdirSync(path.dirname(newDidFilePath), { recursive: true });
          fs.copyFileSync(backendDid, newDidFilePath);
        }
      } catch (error) {
        console.log(error);
      }
    }

    const canisterDetails = await Promise.all(
      Object.keys(canisters).map(async (name) => {
        const type = canisters[name]?.type || "unknown";
        const category = type === "rust" ? "backend" : "frontend";
        let wasmPath = "";
        let frontendIdlFactoryPath: string | undefined;

        if (type === "rust") {
          console.log("Building Rust project...");
          execSync("rustup update");
          execSync("rustup target add wasm32-unknown-unknown");
          execSync("cargo build --release --target wasm32-unknown-unknown", { stdio: "inherit" });
          copyAssetStorageDid(name);

          const didFileName = `${name}.did`;
          const didFilePath = path.resolve("src", name, didFileName);

          if (!fs.existsSync(didFilePath)) {
            throw new Error(`DID file not found: ${didFilePath}`);
          }
          const wasmPath = path.resolve("src", name, `${name}.wasm`);

          const newDidFilePath2 = path.resolve(
            ".dfx",
            "ic",
            "canisters",
            name,
            "service.did"
          );

          fs.copyFileSync(didFilePath, newDidFilePath2);

          const wasmFilePath = path.resolve(
            "target",
            "wasm32-unknown-unknown",
            "release",
            `${name.replace(/-/g, '_')}.wasm`
          );


          const newWasmPath = path.resolve(
            ".dfx",
            "ic",
            "canisters",
            name,
            `${name}.wasm`
          );

          if (!fs.existsSync(wasmFilePath)) {
            throw new Error(`WASM file not found: ${wasmFilePath}`);
          }

          execSync(
            `ic-wasm "${wasmFilePath}" -o "${wasmPath}" metadata candid:service -f "${newDidFilePath2}" -v public`,
            { stdio: "inherit" }
          );

          execSync(
            `ic-wasm "${wasmFilePath}" -o "${newWasmPath}" metadata candid:service -f "${newDidFilePath2}" -v public`,
            { stdio: "inherit" }
          );


          wasmPath;
        } else if (type == "motoko") {
          console.log("Building Motoko project...", name);
          const rootPath = path.join(process.cwd());
          const buildCommand = "moc -o mot_backend.wasm main.mo";
          // execSync(buildCommand, {
          //   cwd: `${rootPath}/src/${name}`,
          //   stdio: "inherit",
          //   shell: true,
          // });
          await copyMotokoWasmFile(name);
          const wasmFilePath = path.resolve("src", name, `${name.replace(/-/g, '_')}.wasm`);
          wasmPath = wasmFilePath;
        } else {
          frontendIdlFactoryPath = path.resolve(
            "src",
            "declarations",
            name,
            `${name}.did.js`
          );
          copyAssetStorageDid(name);
          wasmPath = path.resolve(__dirname, "../../src/res/assetstorage.wasm");
        }

        return {
          name,
          type,
          category,
          wasmPath,
          ...(frontendIdlFactoryPath && { frontendIdlFactoryPath }),
        };
      })
    );

    return canisterDetails;
  } catch (error) {
    console.error(`Error occurred: ${error}`);
    process.exit(1);
  }
};


export async function createAgent(): Promise<HttpAgent> {
  let identity: any;
  try {
    identity = await getIdentity();
  } catch (error) {
    console.log("error : ", error);
  }
  const host = "https://ic0.app";
  const agent = new HttpAgent({ identity, host });
  return agent;
}

async function updateCanisterDataFile(canisterName: string, canisterId: Principal) {
  const filePath = path.resolve(process.cwd(), 'canisterid.json');
  try {
    let data: Record<string, string> = {};
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify({}, null, 2), { encoding: 'utf8' });
    }
    const fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' });
    data = JSON.parse(fileContent);
    data[canisterName] = canisterId?.toString();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), { encoding: 'utf8' });
  } catch (error) {
    console.error('Error updating canister data file:', error);
  }
}

export async function createAndInstallCanisters() {
  try {
    const canisterDetails = await getCanisterDetails();
    const agent = await createAgent();

    for (const canister of canisterDetails) {
      const managementCanister = ICManagementCanister.create({ agent });
      let newCanisterId: any;
      let installMode = "install";
      try {
        const canisterIdPath = path.resolve(process.cwd(), 'canisterid.json');
        if (fs.existsSync(canisterIdPath)) {
          const data = await fs.promises.readFile(canisterIdPath, "utf-8");
          const dfxConfig = JSON.parse(data);
          if (canister.category == "backend") {
            let canisterName = canister.name;
            if (dfxConfig[canisterName]) {
              newCanisterId = Principal?.fromText(dfxConfig[canisterName]);
              await setCanisterId(newCanisterId, canister.name)
              installMode = "reInstall";
              const envData = `VITE_CANISTER_ID_${canisterName.toUpperCase()}_API=${newCanisterId.toText()}\n`;
              const envFilePath = path.join(process.cwd(), '.env');
              if (!fs.existsSync(envFilePath)) {
                fs.writeFileSync(envFilePath, envData);
              } else {
                const fileContent = fs.readFileSync(envFilePath, { encoding: 'utf-8' });
                const variableKey = `VITE_CANISTER_ID_${canisterName.toUpperCase()}_API=`;
                if (!fileContent.includes(variableKey)) {
                  if (fs.existsSync(envFilePath)) {
                    fs.appendFileSync(envFilePath, envData);
                  } else {
                    fs.writeFileSync(envFilePath, envData);
                  }
                }
              }
            } else {
              let canisterName = canister.name;
              const actor = await createCanisterActor();
              // let data: any = await actor?.get_canister_id();
              let data: any = {};
              newCanisterId = data.Ok;
              await setCanisterId(newCanisterId, canister.name)
              const envData = `VITE_CANISTER_ID_${canisterName.toUpperCase()}_API=${newCanisterId?.toText()}\n`;
              const variableKey = `VITE_CANISTER_ID_${canisterName.toUpperCase()}_API=`;

              const envFilePath = path.join(process.cwd(), '.env');
              if (!fs.existsSync(envFilePath)) {
                fs.writeFileSync(envFilePath, envData);
              } else {
                const fileContent = fs.readFileSync(envFilePath, { encoding: 'utf-8' });
                if (!fileContent.includes(variableKey)) {
                  if (fs.existsSync(envFilePath)) {
                    fs.appendFileSync(envFilePath, envData);
                  } else {
                    fs.writeFileSync(envFilePath, envData);
                  }
                }
              }
            }
          } else if (canister.category == "frontend") {
            let canisterName = canister.name;
            if (dfxConfig[canisterName]) {
              newCanisterId = Principal?.fromText(dfxConfig[canisterName])
              installMode = "reInstall";
              const envData = `VITE_CANISTER_ID_${canisterName.toUpperCase()}_API=${newCanisterId.toText()}\n`;
              const variableKey = `VITE_CANISTER_ID_${canisterName.toUpperCase()}_API=`;
              const envFilePath = path.join(process.cwd(), '.env');

              if (!fs.existsSync(envFilePath)) {
                fs.writeFileSync(envFilePath, envData);
              } else {
                const fileContent = fs.readFileSync(envFilePath, { encoding: 'utf-8' });
                if (!fileContent.includes(variableKey)) {
                  if (fs.existsSync(envFilePath)) {
                    fs.appendFileSync(envFilePath, envData);
                  } else {
                    fs.writeFileSync(envFilePath, envData);
                  }
                }
              }
            } else {
              let canisterName = canister.name;
              const actor = await createCanisterActor();
              // let data: any = await actor?.get_canister_id();
              let data : any = {};
              newCanisterId = data.Ok;
              const envData = `VITE_CANISTER_ID_${canisterName.toUpperCase()}_API=${newCanisterId?.toText()}\n`;
              const variableKey = `VITE_CANISTER_ID_${canisterName.toUpperCase()}_API=`;

              const envFilePath = path.join(process.cwd(), '.env');
              if (!fs.existsSync(envFilePath)) {
                fs.writeFileSync(envFilePath, envData);
              } else {
                const fileContent = fs.readFileSync(envFilePath, { encoding: 'utf-8' });
                if (!fileContent.includes(variableKey)) {
                  if (fs.existsSync(envFilePath)) {
                    fs.appendFileSync(envFilePath, envData);
                  } else {
                    fs.writeFileSync(envFilePath, envData);
                  }
                }
              }
            }
          }
        } else {
          await transferCyclesToCanister();
          let canisterName = canister.name;
          // const actor = await createCanisterActor();
          const actor: any = {};
          // let data: any = await actor?.get_canister_id();
          let data : any = {};
          newCanisterId = data.Ok;
          if (canister.category == "backend") {
            await setCanisterId(newCanisterId, canister.name)
          }
          const envData = `VITE_CANISTER_ID_${canisterName.toUpperCase()}_API=${newCanisterId?.toText()}\n`;
          const variableKey = `VITE_CANISTER_ID_${canisterName.toUpperCase()}_API=`;

          const envFilePath = path.join(process.cwd(), '.env');
          if (!fs.existsSync(envFilePath)) {
            fs.writeFileSync(envFilePath, envData);
          } else {
            const fileContent = fs.readFileSync(envFilePath, { encoding: 'utf-8' });
            if (!fileContent.includes(variableKey)) {
              if (fs.existsSync(envFilePath)) {
                fs.appendFileSync(envFilePath, envData);
              } else {
                fs.writeFileSync(envFilePath, envData);
              }
            }
          }
        }
      } catch (error) {
        console.log("error detucted : ", error);
      }
      if (newCanisterId && canister.name) {
        await updateCanisterDataFile(canister.name, newCanisterId);
      }

      if (canister.name === "backend") {
        await install(managementCanister, newCanisterId, canister.wasmPath, installMode);
        console.log(`\x1b[1mCreated backend canister:\x1b[0m \x1b[1;34mhttps://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/?id=${newCanisterId}\x1b[0m`);
      } else {
        console.log(`frontend canister is creating...`);
        await install(managementCanister, newCanisterId, canister.wasmPath, installMode);
        const filePath: any = path.resolve(process.cwd(), ".dfx", "ic", "canisters", canister.name, "assetstorage.did")
        try {
          if (!fs.existsSync(filePath)) {
            throw new Error(`filePath does not exist at: ${filePath}`);
          }
          const rootPath = path.join(process.cwd());
          const buildCommand = "npm run build"
          await execSync(buildCommand, {
            cwd: `${rootPath}`,
            shell: true,
            stdio: "ignore",
          });
        } catch (error) {
          await getCanisterDetails();
          const rootPath = path.join(process.cwd());
          const buildCommand = "npm run build"
          await execSync(buildCommand, {
            cwd: `${rootPath}`,
            shell: true,
            stdio: "ignore",
          });
        }
        const feActor = await getActor(agent, newCanisterId);
        await uploadFrontEndAssets(feActor, newCanisterId, canister.name);
        console.log(`\x1b[1mCode installed successfully for canister:\x1b[0m\x1b[1;34mhttps://${newCanisterId}.icp0.io/\x1b[0m`);

      }
    }
  } catch (error) {
    console.error("Error creating and installing canisters:", error);
  }
}

async function install(
  managementCanister: ICManagementCanister,
  canisterId: Principal,
  wasmPath: string,
  installMode: string,
): Promise<void> {
  try {
    if (!fs.existsSync(wasmPath)) {
      throw new Error(`WASM file not found: ${wasmPath}`);
    }
    console.log("wasmPath",wasmPath);
    const UserPrincipal = await getCurrentPrincipal();

    const wasmBuffer = await fs.promises.readFile(wasmPath);
    const wasmModule = new Uint8Array(wasmBuffer);

    const initArgs = {
      owner: UserPrincipal,
      name: "assetstorage.wasm",
    };

    const candidType = IDL.Record({
      owner: IDL.Principal,
      name: IDL.Text,
    });

    const arg: any = IDL.encode([candidType], [initArgs]);

    if (installMode == "install") {
      await managementCanister.installCode({
        mode: InstallMode.Install,
        canisterId,
        wasmModule,
        arg: arg,
      });
    } else if (installMode == "reInstall") {
      await managementCanister.installCode({
        mode: InstallMode.Reinstall,
        canisterId,
        wasmModule,
        arg: arg,
      });
    }


  } catch (error) {
    console.error(
      `Error during code installation for canister ${canisterId}:`,
      error
    );
  }
}

async function uploadFrontEndAssets(
  FrontendCanisterActor: any,
  canisterId: Principal,
  canisterName: any
): Promise<void> {
  try {
    const distPath = path.join(process.cwd(), "src", canisterName, "dist");
    const files = await getFiles(distPath);

    for (const file of files) {
      const filePath = path.join(distPath, file);
      const fileContent = await fs.promises.readFile(filePath);
      const fileKey = `/${file.replace(/\\/g, "/")}`;

      const args = {
        key: fileKey,
        content: new Uint8Array(fileContent),
        content_type: getMimeType(file),
        content_encoding: "identity",
        sha256: [],
        aliased: [],
      };

      await FrontendCanisterActor.store(args);
    }
  } catch (error) {
    console.error("Error uploading frontend assets:", error);
  }
}

async function getFiles(
  dir: fs.PathLike,
  fileList: string[] = [],
  baseDir = dir
): Promise<string[]> {
  try {
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir.toString(), entry.name);
      if (entry.isDirectory()) {
        await getFiles(fullPath, fileList, baseDir);
      } else {
        const relativePath = path.relative(baseDir.toString(), fullPath);
        fileList.push(relativePath);
      }
    }
    return fileList;
  } catch (error) {
    console.error(`❌ Error reading directory ${dir.toString()}:`, error);
    throw error;
  }
}

function getMimeType(fileName: string): string {
  try {
    if (fileName.endsWith(".html")) return "text/html";
    if (fileName.endsWith(".css")) return "text/css";
    if (fileName.endsWith(".js")) return "application/javascript";
    if (fileName.endsWith(".svg")) return "image/svg+xml";
    if (fileName.endsWith(".png")) return "image/png";
    if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) return "image/jpeg";
    return "application/octet-stream";
  } catch (error) {
    console.error(`❌ Error determining MIME type for ${fileName}:`, error);
    return "application/octet-stream";
  }
}


