// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "hardhat/console.sol";

/// @title Ethernaut Delegation level
contract Delegate {
    // 📖 Important notes
    // EVM assign slot number to the field variables.
    address public owner;
    address public slot;

    constructor(address _owner) {
        owner = _owner;
    }

    function pwn() public {
        console.log("pwn() called");
        owner = msg.sender;
    }

    /// @notice Check the test script to see how would this function be called.
    function pwn(address _owner) public {
        console.log("pwn(address _owner) called");
        console.log(_owner);
        owner = _owner;
    }
}
