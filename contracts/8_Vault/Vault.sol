// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "hardhat/console.sol";

contract Vault {
    bool public locked;
    bytes32 private password;

    constructor(bytes32 _password) {
        locked = true;
        password = _password;
    }

    function unlock(bytes32 _password) public {
        if (_password == password) {
            locked = false;
            console.log("Vault unlocked!");
        } else {
            console.log("Vault locked!");
        }
    }
}
