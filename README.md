# Introduction

This project contains the solution for all the challenges in Ethernaut

# Basic Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```

# Commands history

##### Init node project

Run `npm init` and just press p all the way until the `package.json` file is created

##### Installing hardhat

`npm install --save-dev hardhat`

##### Creating a sample project

Run `npx hardhat` and select `Create a sample project`

Installing dependencies:

`npm install --save-dev @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers`

##### Verifyint contracts

- Command line
  `npx hardhat verify --network rinkeby 0xB51B1ABF43236cB53D434374E98e89f94Daa249a`

- Programatically
  `await hre.run("verify:verify", { address: hackFlip.address });`

##### Running a deployment/hack script

Run `npx hardhat run scripts/4_Telephone.js`

##### Running a test script

Run `npx hardhat test test/4_TelephoneTest.js --network hardhat`. You can try in Rinkeby but you might run into timeouts due to slow block processing.

##### Slither

You have to install in Windows the next: https://github.com/crytic/solc-select#unsupported-platform-on-windows.

The issue I had with Slither in Windows: https://github.com/crytic/slither/issues/1269

###### Documentation

📖 Documentation here: https://github.com/crytic/slither/wiki/Usage

###### Run all

Run `slither .`

###### Filter detectors:

- - `slither . --detect external-function`
- - `slither . --detect constant-states`
- - `slither . --detect unused-state-variables`
- - `slither . --detect too-many-digits`
- - `slither . --detect unused-return`
- - `slither . --detect dangerous-strict-equalities`
- - `slither . --detect redundant-statements`
- - `slither . --detect solc-version`
- - `slither . --detect controlled-delegatecall`

###### Filter paths:

- - `slither . --filter-paths "hardhat|openzeppelin" --exclude naming-convention assembly`
- - `slither . --filter-paths "hardhat|openzeppelin|Delegation.sol" --triage-mode`
- - `slither . --filter-paths "hardhat|openzeppelin" --triage-mode`

###### Triage mode:

- - `slither . --triage-mode --filter-paths "hardhat|openzeppelin" --exclude naming-convention assembly`

###### Printing solidity contract

Run `slither . --print contract-summary`
Run `slither . --print human-summary`

To generate a Markdown report, use `slither . --checklist`

To generate a Markdown with GitHub source code highlighting, use `slither [target] --checklist --markdown-root https://github.com/ORG/REPO/blob/COMMIT/` (replace ORG, REPO, COMMIT). Example:

Run `slither . --checklist --markdown-root https://github.com/PedroReyes/ethernaut/commit/8149ef27a96ee88af24f5a7a7cea7b3ca17a3ca4`

###### To export the result to a json file

Run `slither . --json file.json`
