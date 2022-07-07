// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

contract Telephone {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function changeOwner(address newOwner) external {
        require(newOwner != address(0), "Invalid address");
        if (tx.origin != msg.sender) {
            owner = newOwner;
        }
    }
}
