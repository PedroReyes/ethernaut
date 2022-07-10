import fs from "fs";
import { docgen } from "solidity-docgen";

console.log(
  "🟡 This is a beta version of docgen.js. It is not yet production ready."
);

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
  const json = JSON.parse(
    fs.readFileSync("artifacts/contracts/Vault.sol/Vault.json")
  );

  // await docgen([{ output: json }, config]);
} catch (e) {
  console.log(e);
}
