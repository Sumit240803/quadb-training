import { installRustBakend } from "../Projects/Backend/installRust";
import { installReactFrontend } from "../Projects/Frontend/installReactJS";
import { installVueFrontend } from "../Projects/Frontend/installVueJS";
const fs = require("fs");
const path = require("path");

export async function createIcpProject(projectName: String, backendLanguage: String, frontendLanguage: any) {
  try {
    if (!projectName) {
      console.error("Please provide a project name.");
      return;
    }
    const projectPath = path.join(process.cwd(), projectName);
    fs.mkdirSync(projectPath, { recursive: true });
    const dfxJson = {
      "canisters": {
        ...(backendLanguage == "Rust" ? {
          [`${projectName}_backend`]: {
            "candid": `src/${projectName}_backend/${projectName}_backend.did`,
            "package": `${projectName}_backend`,
            "type": "rust",
          },
        } : {
          [`${projectName}_backend`]: {
            "main": `src/${projectName}_backend/main.mo`,
            "type": "motoko",
          },
        }),

        ...(frontendLanguage !== "None" && {
          [`${projectName}_frontend`]: {
            "dependencies": [`${projectName}_backend`],
            "source": [`src/${projectName}_frontend/dist`],
            "type": "assets",
            "workspace": `${projectName}_frontend`,
          },
        }),
      },

      "defaults": {
        "build": {
          "args": "",
          "packtool": "",
        },
      },
      "output_env_file": ".env",
      "version": 1,
    };
    if (backendLanguage == "Rust") {
      await installRustBakend(projectName, projectPath, dfxJson);
      if (frontendLanguage == "React") {
        await installReactFrontend(projectName, projectPath);
        return;
      } else if (frontendLanguage == "Vue") {
        await installVueFrontend(projectName, projectPath);
        return;
      }
      return;
    }
  } catch (error) {
    console.error("❌ Error creating ICP project:", error);
  }

}
