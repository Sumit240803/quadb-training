const { expect } = require("chai");
const hre = require("hardhat");
const { ethers } = hre;

describe("Reentrancy Attack Simulation", function () {
  let vulnerable, attacker;
  let deployer, user, hacker;

  beforeEach(async () => {
    [deployer, user, hacker] = await ethers.getSigners();

    const Vulnerable = await ethers.getContractFactory("Vulnerable");
    vulnerable = await Vulnerable.deploy();
    await vulnerable.waitForDeployment();
    const vulnerableAddress = await vulnerable.getAddress();

    const Attacker = await ethers.getContractFactory("Attacker", hacker);
    attacker = await Attacker.deploy(vulnerableAddress);
    await attacker.waitForDeployment();

    await vulnerable.connect(user).deposit({ value: ethers.parseEther("5") });
  });

  it("Should drain funds via reentrancy", async () => {
    console.log("Initial vulnerable balance:", ethers.formatEther(await ethers.provider.getBalance(await vulnerable.getAddress())));

    await attacker.connect(hacker).attack({ value: ethers.parseEther("1") });

    const finalVulnerableBal = await ethers.provider.getBalance(await vulnerable.getAddress());
    const attackerBal = await ethers.provider.getBalance(await attacker.getAddress());

    console.log("Final vulnerable balance:", ethers.formatEther(finalVulnerableBal));
    console.log("Attacker balance:", ethers.formatEther(attackerBal));

    expect(finalVulnerableBal).to.equal(0n);
    expect(attackerBal).to.be.gt(ethers.parseEther("1"));
  });
});
