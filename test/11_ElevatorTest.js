const { expect } = require("chai");
const { ethers } = require("hardhat");
const hre = require("hardhat");
const { consoleLogTitleH1, consoleLogMessage } = require("../utils/utils.js");

describe("Elevator", function () {
  let deployer;
  let hacker;
  let tester;

  before(async function () {
    consoleLogTitleH1("Level 11 - Elevator");

    consoleLogMessage(`💻 Network: ${hre.network.name}`);

    // 🔨 Addresses
    [deployer, hacker, tester] = await ethers.getSigners();
  });

  it("Should go to the top in  Elevator.sol", async function () {
    // 📗 Contract to be hacked
    const Contract = await ethers.getContractFactory("Elevator", deployer);
    const contract = await Contract.connect(deployer).deploy();
    await contract.deployed();

    // 📕 Deploy the contract that will execute the hack
    const HackContract = await ethers.getContractFactory(
      "HackElevator",
      hacker
    );
    const hackContract = await HackContract.connect(hacker).deploy(
      contract.address
    );
    await hackContract.deployed();

    // 👿 Hacking the contract
    consoleLogMessage("👿 Hacking the contract...");
    tx = await hackContract.connect(hacker).hackElevator();
    tx = await tx.wait((confirms = 1));

    consoleLogMessage("\n");
    consoleLogMessage("👿 Hack hash\n");
    consoleLogMessage(tx);
    consoleLogMessage("\n");

    // ✅ Check if the hack was successful
    consoleLogMessage("✅ Checking if the hack was successful...");
    let isOnTop = await contract.top();
    consoleLogMessage(`👿 Elevator is on top: ${isOnTop}`);

    expect(isOnTop).to.be.true;
  });
});
