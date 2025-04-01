const {ethers} = require("hardhat");
async function main(){
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contract with ", deployer.address);

    const vrfCoordinator = ethers.getAddress("0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625"); 
    const linkToken = ethers.getAddress("0x779877A7B0D9E8603169DdbD7836e478b4624789"); 
    const keyHash = "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c";
    const fee = ethers.parseEther("0.1");  // 0.1 LINK in Wei
    const entryFee = ethers.parseEther("0.01");

    const Lottery = await ethers.getContractFactory("Lottery");
    const lottery = await Lottery.deploy(vrfCoordinator,linkToken,keyHash,fee,entryFee);
    await lottery.waitForDeployment();
    console.log("Lottery contract deployed at:", lottery.target);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });