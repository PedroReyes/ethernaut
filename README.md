# Introduction

This project contains the solution for all the challenges in Ethernaut

# Usage

We have code tours in this project so install the next VSCode extension for a better onboarding to the project: https://marketplace.visualstudio.com/items?itemName=vsls-contrib.codetour

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

###### Init node project

Run `npm init` and just press p all the way until the `package.json` file is created

###### Installing hardhat

`npm install --save-dev hardhat`

###### Creating a sample project

Run `npx hardhat` and select `Create a sample project`

Installing dependencies:

`npm install --save-dev @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers`

###### Verifyint contracts

- Command line
  `npx hardhat verify --network rinkeby 0xB51B1ABF43236cB53D434374E98e89f94Daa249a`

- Programatically
  `await hre.run("verify:verify", { address: hackFlip.address });`

###### Running a deployment/hack script

Run `npx hardhat run scripts/4_Telephone.js`

###### Running a test script

Run `npx hardhat test test/4_TelephoneTest.js --network hardhat`. You can try in Rinkeby but you might run into timeouts due to slow block processing.

###### Inline bookmarks extension

Use this bookmarks in order to do a follow up of which functions from a smart contract you already audited:

```
// @audit just for testing
// @audit-ok message here
// @audit-issue issue explained here
// @audit-info message here
// @todo message here
// @note message here
// @remind message here
// @follow-up message here
```
