require("@nomiclabs/hardhat-waffle");
require("solidity-docgen");
const { task } = require("hardhat/config");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("print-paths", (_, hre) => {
  console.log(hre.config.paths);
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  docgen: {
    outputDir: "docs/docgen",
    /**
     * A directory of custom templates that should take precedence over the
     * theme's templates.
     */
    templates: "./contracts/templates",

    /**
     * The way documentable items (contracts, functions, custom errors, etc.)
     * will be organized in pages. Built in options are:
     * - 'single': all items in one page
     * - 'items': one page per item
     * - 'files': one page per input Solidity file
     * More customization is possible by defining a function that returns a page
     * path given the AST node for the item and the source unit where it is
     * defined.
     * Defaults to 'single'.
     */
    pages: "files",

    /**
     * An array of sources subdirectories that should be excluded from documentation.
     */
    // exclude: ["Greeter.sol"],
  },
  // docgen: { templates: "./contracts/templates" },
};
