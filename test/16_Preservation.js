const { expect } = require("chai");
const { ethers } = require("hardhat");
const hre = require("hardhat");
const { consoleLogTitleH1, consoleLogMessage } = require("../utils/utils.js");

describe("Elevator", function () {
  let deployer;
  let hacker;
  let tester;

  before(async function () {
    consoleLogTitleH1("Level 16 - Preservation");

    consoleLogMessage(`💻 Network: ${hre.network.name}`);

    // 🔨 Addresses
    [deployer, hacker, tester] = await ethers.getSigners();
  });

  it("Should hack Preservation.sol", async function () {
    consoleLogMessage(`🤓 Hacker: ${hacker.address}`);

    // 📒 Libraries
    const Library = await ethers.getContractFactory(
      "LibraryContract",
      deployer
    );
    const library1 = await Library.connect(deployer).deploy();
    await library1.deployed();

    const library2 = await Library.connect(deployer).deploy();
    await library2.deployed();

    // 📗 Contract to be hacked
    const contractName = "Preservation";
    const Contract = await ethers.getContractFactory(contractName, deployer);
    const contract = await Contract.connect(deployer).deploy(
      library1.address,
      library2.address
    );
    await contract.deployed();

    // 📕 Deploy the contract that will execute the hack
    const HackContract = await ethers.getContractFactory(
      "Hack" + contractName,
      hacker
    );
    const hackContract = await HackContract.connect(hacker).deploy(
      contract.address
    );
    await hackContract.deployed();

    // 🔊 Logging contracts addresses
    console.log(`📗 ${contractName}.sol address: \n${contract.address}\n`);
    console.log(
      `📕 Hack${contractName}.sol address: \n${hackContract.address}\n`
    );

    // 🔊 Logging
    consoleLogMessage("👿 Current status...");
    await logging(contract, hackContract);

    // 👿 Hacking the library
    consoleLogMessage("👿 Hacking the library...");
    tx = await hackContract.connect(hacker).hackLibrary();
    tx = await tx.wait((confirms = 1));

    // 🔊 Logging
    await logging(contract, hackContract);

    // 👿 Hacking the contract
    consoleLogMessage("👿 Hacking the contract...");
    tx = await hackContract.connect(hacker).hackPreservation();
    tx = await tx.wait((confirms = 1));

    // 🔊 Logging
    await logging(contract, hackContract);

    // 👀 Check if the hack was successful
    expect(await contract.owner()).to.equals(hacker.address);
  });
});

async function logging(contract, hackContract) {
  consoleLogMessage(`🔊 Malicious library: ${hackContract.address}`);
  consoleLogMessage(`🔊 Library: ${await contract.timeZone1Library()}`);
  consoleLogMessage(`🔊 Owner: ${await contract.owner()}`);
  consoleLogMessage("\n\n");
}
