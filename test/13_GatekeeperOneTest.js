const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GatekeeperOne", function () {
  let deployer;
  let hacker;
  let tester;

  it("Should hack GatekeeperOne.sol", async function () {
    // 🔨 Addresses
    [deployer, hacker, tester] = await ethers.getSigners();

    // 📗 Contract to be hacked
    const contractName = "GatekeeperOne";
    const Contract = await ethers.getContractFactory(contractName, deployer);
    const contract = await Contract.connect(deployer).deploy();
    await contract.deployed();

    // 📕 Deploy the contract that will execute the hack
    const HackGatekeeperOne = await ethers.getContractFactory(
      "Hack" + contractName,
      hacker
    );
    const hackGatekeeperOne = await HackGatekeeperOne.connect(hacker).deploy(
      contract.address
    );
    await hackGatekeeperOne.deployed();

    // 👿 Hacking the contract
    // 🗣 Logging status
    console.log(`🔑 Entrant: ${await contract.entrant()} \n`);

    // 📖 https://docs.ethers.io/v4/api-utils.html#solidity
    const tx = await hackGatekeeperOne.attackUsingNativeEncode();
    await tx.wait((confirms = 1)); // wait until the transaction is mined

    // 🗣 Logging status
    console.log(`🔑 Entrant: ${await contract.entrant()} \n`);

    // ✅ Check if the hack was successful
    expect(await contract.entrant()).to.be.not.eq(
      "0x0000000000000000000000000000000000000000"
    );
  });
});
