const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("📗 Telephone", function () {
  let owner;
  let bob;

  it("🤓 Should change the owner of Telephone", async function () {
    [owner, bob] = await ethers.getSigners();

    const Telephone = await ethers.getContractFactory("Telephone", owner);
    const telephone = await Telephone.deploy();
    await telephone.deployed();

    const HackTelephone = await ethers.getContractFactory("HackTelephone", bob);
    const hackTelephone = await HackTelephone.deploy(telephone.address);
    await hackTelephone.deployed();

    expect(await telephone.owner()).to.equal(owner.address);

    const changeOwnerTx = await hackTelephone.changeOwner(bob.address);

    // wait until the transaction is mined
    await changeOwnerTx.wait((confirms = 1));

    expect(await telephone.owner()).to.equal(bob.address);
  });
});
