// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
// > npx hardhat run scripts/18_MagicNumber.js --network goerli
const hre = require("hardhat");
const { consoleLogMessage } = require("../utils/utils");

async function main() {
  // 👉 Contract name and address
  const contractName = "MagicNumber";
  const contractAddress = "0xb10B742191C3d9115dcfe1feE77C8143574C0640";

  // 📗 We get the contract to be hacked
  const contract = await hre.ethers.getContractAt(
    contractName,
    contractAddress
  );

  // Display the solver address
  let solverAddress = await contract.solver();
  consoleLogMessage(`🔊 Solver address:\n${solverAddress}\n\n`);

  // 🔨 Get accounts
  let [hacker, _, tester] = await hre.ethers.getSigners();
  hacker = tester;
  console.log(`🤓 Hacker address:\n ${hacker.address} \n`);

  if (true) {
    // 📕 Deploy the contract that will return the bytecode of the hack contract
    const contractDeployBytecode = await ethers.getContractFactory(
      "DeployBytecode",
      hacker
    );

    // 📕 Deploy the contract that will execute the hack
    // 🌐 https://remix.ethereum.org/#lang=en&optimize=false&runs=200&evmVersion=null&version=soljson-v0.8.18+commit.87f61d96.js

    // 📘 Construction bytecode (69) - 
    // PUSH the next 10 bytes to the stack
    // 0x69 - https://www.ethervm.io/#69 - 
    // PUSH the next 10 bytes to the stack

    // 📘 Runtime bytecode (602a60005260206000f3) - 
    // Push to the stack the next code that 
    // does "Store 42 and return it": 

    // 0x60 2a - https://www.ethervm.io/#60 - PUSH 42
    // 0x60 00 - https://www.ethervm.io/#60 - PUSH 0
    // 0x52 - https://www.ethervm.io/#52 - MSTORE (store 42 at [0, 32])
    // 0x60 20 - https://www.ethervm.io/#60 - PUSH 32
    // 0x60 00 - https://www.ethervm.io/#60 - PUSH 0
    // 0xf3 - https://www.ethervm.io/#F3 - RETURN
    // Total opcodes: 602a60005260206000f3
    // 0x69602a60005260206000f3
    // 0x00000000000000000000000000000000000000000000602a60005260206000f3

    // 📘 Save runtime bytecode to memory (600052600a6016f3)
    // 0x69 602a60005260206000f3 - PUSH the next 10 bytes to the stack
    // 0x60 00                   - PUSH 0
    // 0x52                      - MSTORE (store 10 at [0, 32])

    // 📘 Initialization bytecode (600052600a6016f3)
    // 0x60 0a                   - PUSH 10 (length of runtime bytecode)
    // 0x60 16                   - PUSH 22 (offset for runtime bytecode,
    // 0xf3                      - RETURN https://www.ethervm.io/#F3
    //                             22 (offset) + 10 (runtime code)= 32)

    // stack (1024 positions, only top 16 are easily accessible) vs memory (non-persistent, less cost) vs storage (persistent between contract calls) - https://gavwood.com/paper.pdf
    let bytecode = `0x69602a60005260206000f3600052600a6016f3`;
    let tx = await hacker.sendTransaction({
      from: hacker.address,
      data: bytecode,
    });

    tx = await tx.wait((confirms = 1));

    // 🔊 DeployBytecode - transaction hash
    consoleLogMessage(
      `🔊 DeployBytecode - Transaction hash:\n${tx.transactionHash}\n\n`
    );

    // 🔊 DeployBytecode - contract address
    let hackContractAddress = tx.contractAddress;
    consoleLogMessage(
      `🔊 DeployBytecode - Hack contract address:\n${hackContractAddress}\n\n`
    );

    // Set the solver address in the contract
    tx = await contract.setSolver(hackContractAddress);
    tx = await tx.wait((confirms = 1));

    // Display the solver address
    solverAddress = await contract.solver();
    consoleLogMessage(`🔊 Solver address:\n${solverAddress}\n\n`);
  }

  if(false) {
  // 🔊 Call the hack function
  let hackContractAddress = "0x5c7C1383deE7A2A22D7Fedb20c7B8ab2B2546Cbd";
  const solver = await hre.ethers.getContractAt("Solver", hackContractAddress);
  tx = await solver.whatIsTheMeaningOfLife(); // return 42
  console.log(`whatIsTheMeaningOfLife function returns ${tx}`);

  tx = await solver.solve(); // return 42 instead of 32
  console.log(`solve function returns ${tx}`);
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
