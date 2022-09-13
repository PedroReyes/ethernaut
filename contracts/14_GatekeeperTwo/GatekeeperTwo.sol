// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "hardhat/console.sol";

contract GatekeeperTwo {
    address public entrant;

    modifier gateOne() {
        require(msg.sender != tx.origin); // 👉 simply using a contract
        _;
    }

    modifier gateTwo() {
        uint256 x;
        assembly {
            // 👉 while a constructor code is not finished,
            // the size code of the contract is zero.
            // In other words, we have to call GatekeeperTwo from the constructor
            // of our contract
            x := extcodesize(caller())
        }
        require(x == 0);
        _;
    }

    modifier gateThree(bytes8 _gateKey) {
        uint64 maxUint64;

        unchecked {
            maxUint64 = uint64(0) - 1;
        }
        console.log("> maxUint64: ", maxUint64);

        // 111000101000110111111010100110110101111001100101001111110011110
        uint64 a = uint64(bytes8(keccak256(abi.encodePacked(msg.sender))));

        console.log("> a:         ", a);

        uint64 b = uint64(_gateKey);

        console.log("> b:         ", b);

        require(a ^ b == maxUint64);
        _;
    }

    function enter(bytes8 _gateKey)
        public
        gateOne
        gateTwo
        gateThree(_gateKey)
        returns (bool)
    {
        entrant = tx.origin;
        return true;
    }
}
