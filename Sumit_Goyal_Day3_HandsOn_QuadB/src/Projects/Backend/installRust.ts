const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");


export const installRustBakend = async (projectName: String, projectPath: String, dfxJson: any) => {
    const parentCargoFile = `
    [workspace]
    members = [
      "src/${projectName}_backend"
    ]
    resolver = "2"
   `;

    fs.writeFileSync(
        path.join(projectPath, "dfx.json"),
        JSON.stringify(dfxJson, null, 2)
    );

    fs.writeFileSync(path.join(projectPath, "Cargo.toml"), parentCargoFile.trim());
    const rustPath = path.join(projectPath, `src/${projectName}_backend`);
    const declarations = path.join(projectPath, `src/declarations/${projectName}_backend`);
    const rustSrcPath = path.join(rustPath, "src");
    fs.mkdirSync(rustSrcPath, { recursive: true });

    const rustMain = `
use ic_cdk::query;
#[query]
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}
    `;

    const rustCargoToml = `
    [package]
    name = "${projectName}_backend"
    version = "0.1.0"
    edition = "2021"

    [lib]
    crate-type = ["cdylib"]

    [dependencies]
    candid = "0.10"
    ic-cdk = "0.16"
    ic-cdk-timers = "0.10" # Feel free to remove this dependency if you don't need timers
    `;

    const rustDid = ` service : {
    "greet": (text) -> (text) query;
    }; `;

    try {
        await fs.writeFileSync(path.join(rustPath, "Cargo.toml"), rustCargoToml.trim());
        await fs.writeFileSync(path.join(rustSrcPath, "lib.rs"), rustMain.trim());
        await fs.writeFileSync(path.join(rustPath, `${projectName}_backend.did`), rustDid.trim());
        await fs.mkdirSync(declarations, { recursive: true });
        await fs.writeFileSync(path.join(declarations, `${projectName}_backend.did`), rustDid.trim());

        const projectAgentFilePath =
            path.resolve(__dirname, "../../../src/res/agent_backend.did.js");
        const indexFilePath = path.resolve(__dirname, "../../../src/res/index.js");

        const projectAgentFileContent = fs.readFileSync(projectAgentFilePath, 'utf-8');
        const indexFileContent = fs.readFileSync(indexFilePath, 'utf-8');

        await fs.writeFileSync(path.join(declarations, `${projectName}_backend.did.js`), projectAgentFileContent);
        await fs.writeFileSync(path.join(declarations, 'index.js'), indexFileContent);

        const replacementText = `${projectName}_backend`;
        const replacedFile = path.resolve(declarations, "index.js");
        let fileContent = await fs.readFileSync(replacedFile, 'utf8');
        fileContent = fileContent.replace(/project_backend/g, replacementText);
        fileContent = fileContent.replace(/PROJECT_BACKEND/g, replacementText.toUpperCase());
        fileContent = fileContent.replace(/agent_backend/g, replacementText);

        fs.writeFileSync(replacedFile, fileContent, 'utf8');
    } catch (error) {
        console.log(error);
    }
}