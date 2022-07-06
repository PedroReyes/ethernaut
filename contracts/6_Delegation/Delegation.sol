// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "./Delegate.sol";
import "hardhat/console.sol";

/// @title Ethernaut Delegation level
/// @custom:link https://ethernaut.openzeppelin.com/level/0x9451961b7Aea1Df57bc20CC68D72f662241b5493
contract Delegation {
    address public owner; // index 0
    Delegate delegate; // index 1

    constructor(address _delegateAddress) {
        delegate = Delegate(_delegateAddress);
        owner = msg.sender;
    }

    /// @notice No receive function is available and fallback is not payable
    /// @custom:link https://docs.soliditylang.org/en/v0.8.12/contracts.html#fallback-function
    fallback() external {
        console.log("Fallback function called");
        console.logBytes(msg.data);

        // 🟢 Calling from ethers.js
        // "delegatecall" loads the function code from another contract
        // and executes it as if it were its own code.
        // * address(this)
        // * msg.sender
        // * msg.value
        /// @custom:link https://docs.soliditylang.org/en/v0.4.24/units-and-global-variables.html#block-and-transaction-properties
        /// @custom:link https://docs.soliditylang.org/en/v0.8.15/types.html?#members-of-addresses
        /// @custom:link https://docs.soliditylang.org/en/v0.8.12/abi-spec.html#function-selector
        /// @custom:link https://es.wikipedia.org/wiki/Sistema_hexadecimal
        (bool success, bytes memory returndata) = address(delegate)
            .delegatecall(msg.data);

        // 🟢 Calling from solidity without arguments
        /// @custom:link https://docs.soliditylang.org/en/v0.8.15/abi-spec.html
        // 👉 Example of delegate call without parameters in solidity
        // (bool success, bytes memory returndata) = address(delegate)
        //     .delegatecall(abi.encodeWithSignature("pwn()"));

        // 🟢 Calling from solidity with arguments
        // 👉 Example of delegate call with parameters in solidity
        // address _owner = address(0);
        // (bool success, bytes memory returndata) = address(delegate)
        //     .delegatecall(abi.encodeWithSignature("pwn(address)", _owner));

        if (success) {
            /// @custom:link https://docs.soliditylang.org/en/latest/units-and-global-variables.html#contract-related
            this;
        }

        // 📖 Important notes
        // In EVM it has 2^256 slot in Smart Contract storage and
        // each slot can save 32-byte size data.
        // EVM assign slot number to the field variables.

        // If the function call reverted
        if (success == false) {
            // if there is a return reason string
            // 📖 https://solidity-es.readthedocs.io/es/latest/assembly.html#sintaxis
            // 📖 https://docs.soliditylang.org/en/v0.8.12/types.html#fixed-size-byte-arrays
            if (returndata.length > 0) {
                // bubble up any reason for revert
                // 📖 https://jeancvllr.medium.com/solidity-tutorial-all-about-assembly-5acdfefde05c
                assembly {
                    // 📖 https://solidity-es.readthedocs.io/es/latest/assembly.html#sintaxis
                    // 📖 https://solidity-es.readthedocs.io/es/latest/assembly.html#opcodesj
                    // 📖 https://ethereum.github.io/yellowpaper/paper.pdf - explanation of assembly positions
                    // 📖 https://ethereum.stackexchange.com/questions/9603/understanding-mload-assembly-function
                    let returndata_size := mload(returndata)
                    revert(add(32, returndata), returndata_size)
                }
            } else {
                revert("Function call reverted");
            }
        }
    }
}
