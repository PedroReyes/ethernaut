// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "hardhat/console.sol";

/// @title Ethernaut Delegation level
contract Delegate {
    // 📖 Important notes
    // EVM assign slot number to the field variables.
    address public owner;

    // address public constant slot = address(0);

    constructor(address newOwner) {
        require(newOwner != address(0), "Invalid address");
        owner = newOwner;
    }

    function pwn() external {
        console.log("pwn() called");
        owner = msg.sender;
    }

    /// @notice Check the test script to see how would this function be called.
    function pwn(address newOnwer) external {
        require(newOnwer != address(0), "Invalid address");
        console.log("pwn(address newOnwer) called");
        console.log(newOnwer);
        owner = newOnwer;
    }
}
