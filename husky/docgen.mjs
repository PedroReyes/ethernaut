import hre from "hardhat";
import fs from "fs";
import { docgen } from "solidity-docgen";

const config = {
  /**
   * The root directory relative to which 'outputDir', 'sourcesDir', and
   * 'templates' are specified. Defaults to the working directory.
   */
  // root: ".",

  /**
   * The Solidity sources directory.
   */
  // sourcesDir: "./contracts",

  /**
   * The directory where rendered pages will be written.
   * Defaults to 'docs'.
   */
  // outputDir: "docs/test",

  /**
   * A directory of custom templates that should take precedence over the
   * theme's templates.
   */
  //   templates?: string;

  /**
   * The name of the built-in templates that will be used by default.
   * Defaults to 'markdown'.
   */
  theme: "markdown",

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
  pages: "items",

  /**
   * An array of sources subdirectories that should be excluded from documentation.
   */
  //   exclude?: string[];

  /**
   * Clean up the output by collapsing 3 or more contiguous newlines into only 2.
   * Enabled by default.
   */
  //   collapseNewlines?: boolean;

  /**
   * The extension for generated pages.
   * Defaults to '.md'.
   */
  pageExtension: ".md",
};

try {
  // 👉 Generate documentation ( VERSION from the docs)
  // const json = JSON.parse(
  //   fs.readFileSync("artifacts/contracts/Vault.sol/Vault.json")
  // );
  // await docgen([{ output: json }, config]);

  console.log(
    "⚠ This is a beta version of docgen.js. It is not yet production ready."
  );
  console.log("🔨 Generating documentation...");

  // 🗑 delete directories to have a from-scratch documentation generation
  console.log("🔨 Deleting artifacts and docs folders...");
  fs.rmdirSync("./docs", { recursive: true });
  fs.rmdirSync("./artifacts", { recursive: true });

  // 👉 Generate documentation ( VERSION suggested by @frangio)
  hre.run("docgen");

  console.log("🟢 Documentation generated successfully");
} catch (e) {
  console.log(e);
}
