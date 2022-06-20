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

## Init node project

Run `npm init` and just press p all the way until the `package.json` file is created

## Installing hardhat

`npm install --save-dev hardhat`

## Creating a sample project

Run `npx hardhat` and select `Create a sample project`

Installing dependencies:

`npm install --save-dev @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers`

## Verifyint contracts

- Programatically
  `npx hardhat verify --network rinkeby 0xB51B1ABF43236cB53D434374E98e89f94Daa249a`

- Command line
  `await hre.run("verify:verify", { address: hackFlip.address });`
