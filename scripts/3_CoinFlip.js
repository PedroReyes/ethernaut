// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const HackFlip = await hre.ethers.getContractFactory("HackFlip");
  const hackFlip = await HackFlip.deploy();

  await hackFlip.deployed();

  console.log("✅ HackFlip deployed to:", hackFlip.address);

  // Sleep for 15 seconds to allow the contract to be deployed
  await new Promise((r) => setTimeout(r, 15000));

  // Verify contract deployment
  try {
    await hre.run("verify:verify", { address: hackFlip.address });
  } catch (error) {
    // console.error("🔴 Error ocurred while verifying. Check manually");
    console.error(error);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
