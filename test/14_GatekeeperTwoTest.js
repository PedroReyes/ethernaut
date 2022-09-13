const { expect } = require("chai");
const { ethers } = require("hardhat");
const { consoleLogTitleH1, consoleLogMessage } = require("./utils.js");

describe("GatekeeperTwo", function () {
  let deployer;
  let hacker;
  let tester;

  before(async function () {
    consoleLogTitleH1("Level 14 - GatekeeperTwo");

    consoleLogMessage(`💻 Network: ${hre.network.name}`);

    // 🔨 Addresses
    [deployer, hacker, tester] = await ethers.getSigners();
  });

  it("Should hack GatekeeperTwo.sol", async function () {
    // 📗 Contract to be hacked
    const contractName = "GatekeeperTwo";
    const Contract = await ethers.getContractFactory(contractName, deployer);
    const contract = await Contract.connect(deployer).deploy();
    await contract.deployed();

    // 👿 Hacking the contract
    // 🗣 Logging status
    consoleLogMessage(`🔑 Entrant: ${await contract.entrant()} \n`);

    // 📕 Deploy the contract that will execute the hack
    const HackGatekeeperTwo = await ethers.getContractFactory(
      "Hack" + contractName,
      hacker
    );
    const hackGatekeeperTwo = await HackGatekeeperTwo.connect(hacker).deploy(
      contract.address,
      {
        gasLimit: 1000000, // 👈 Gas limit increased to avoid running out of gas
      }
    );
    await hackGatekeeperTwo.deployed();

    // 🗣 Logging status
    consoleLogMessage(`🔑 Entrant: ${await contract.entrant()} \n`);

    // ✅ Check if the hack was successful
    expect(await contract.entrant()).to.be.not.eq(
      "0x0000000000000000000000000000000000000000"
    );
  });
});
