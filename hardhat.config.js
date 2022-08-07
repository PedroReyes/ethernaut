require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
const { task } = require("hardhat/config");
require("dotenv").config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: "rinkeby", // default: "hardhat",

  mocha: {
    timeout: 120000,
  },

  networks: {
    hardhat: {
      // 👉 For using the local node by default you have
      // to comment the forking section
      // 👉 You can execute a local node with info from the
      // blockchain you want to fork by uncomment the next lines
      // `npx hardhat node` for running local node
      // url: "http://localhost:8545",
      // timeout: 520000,
      // forking: {
      //   // 👉 Using nodereal might have a cost (they have a free tier)
      //   url:
      //     "https://bsc-mainnet.nodereal.io/v1/" +
      //     process.env.ARCHIVE_NODE_API_KEY,
      //   blockNumber: 20242102,
      // },
    },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/" + process.env.INFURA_ID,
      accounts: [
        process.env.DEPLOYER_PRIVATE_KEY,
        process.env.HACKER_PRIVATE_KEY,
        process.env.TESTING_PRIVATE_KEY,
      ],
      timeout: 120000,
    },
    goerli: {
      url: "https://goerli.infura.io/v3/" + process.env.INFURA_ID,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY],
    },
    ropsten: {
      url: "https://ropsten.infura.io/v3/" + process.env.INFURA_ID,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY],
    },
    bsc_mainnet: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      gasPrice: 20000000000,
      accounts: [
        process.env.DEPLOYER_PRIVATE_KEY,
        process.env.HACKER_PRIVATE_KEY,
        process.env.TESTING_PRIVATE_KEY,
      ],
    },
    bsc_testnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: [
        process.env.DEPLOYER_PRIVATE_KEY,
        process.env.HACKER_PRIVATE_KEY,
        process.env.TESTING_PRIVATE_KEY,
      ],
    },
  },

  solidity: {
    compilers: [
      {
        version: "0.8.10",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
    ],
  },

  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: {
      rinkeby: process.env.ETHERSCAN_API_KEY,
      goerli: process.env.ETHERSCAN_API_KEY,
      ropsten: process.env.ETHERSCAN_API_KEY,
    },
    customChains: [
      {
        network: "rinkeby",
        chainId: 4,
        urls: {
          apiURL: "https://api-rinkeby.etherscan.io/api",
          browserURL: "https://rinkeby.etherscan.io",
        },
      },
    ],
  },
};
