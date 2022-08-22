const { expect } = require("chai");
const { ethers } = require("hardhat");
const hre = require("hardhat");

describe("Elevator", function () {
  let deployer;
  let hacker;
  let tester;

  before(async function () {
    console.log(`💻 Network: ${hre.network.name}`);

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
    console.log("👿 Hacking the contract...");
    tx = await hackContract.connect(hacker).hackElevator();
    tx = await tx.wait((confirms = 1));

    console.log("\n");
    console.log("👿 Hack hash\n");
    console.log(tx);
    console.log("\n");

    // ✅ Check if the hack was successful
    console.log("✅ Checking if the hack was successful...");
    let isOnTop = await contract.top();
    console.log(`👿 Elevator is on top: ${isOnTop}`);

    expect(isOnTop).to.be.true;
  });
});
