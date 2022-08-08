const { expect } = require("chai");
const { ethers } = require("hardhat");
const hre = require("hardhat");

describe("Reentrance", function () {
  let deployer;
  let hacker;
  let tester;

  before(async function () {
    console.log(`💻 Network: ${hre.network.name}`);

    // 🔨 Addresses
    [deployer, hacker, tester] = await ethers.getSigners();
  });

  it("Should withdraw all the ether from Reentrance.sol", async function () {
    // 📗 Contract
    // const Contract = await ethers.getContractFactory("GNBU", deployer);
    // const contract = await Contract.connect(deployer).deploy();
    // await contract.deployed();

    // Access to a contract already deployed
    const contractName = "GNBU";
    const contractAddress = "0xA4d872235dde5694AF92a1d0df20d723E8e9E5fC";

    // 📗 We get the contract to be hacked
    const contract = await hre.ethers.getContractAt(
      contractName,
      contractAddress
    );

    let address = "0xA901f1381EB7f859d614827783359def73058959";

    console.log(`GNBU balance: ${await contract.balanceOf(address)}`);
  });
});
