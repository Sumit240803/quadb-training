const hre = require("hardhat");

async function main() {
    const SimpleStorage = await hre.ethers.getContractFactory("SimpleStorage");
    const simpleStorage = await SimpleStorage.deploy();
    await simpleStorage.waitForDeployment();

    console.log("Contract deployed at:", simpleStorage.target);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
