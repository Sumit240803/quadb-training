const hre = require("hardhat");
async function main(){
    const TicketMarktplace = await hre.ethers.getContractFactory("TicketMarketPlace");
    const ticketMarktplace = await TicketMarktplace.deploy();
    await ticketMarktplace.waitForDeployment();
    console.log("Contract Deployed At ", ticketMarktplace.target);
}

main().then(()=>process.exit(0)).catch((error)=>{console.log(error)});