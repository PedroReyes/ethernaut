// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "hardhat/console.sol";

/// @title Contract for hacking Token.sol from Ethernaut
/// @author Pedro Reyes
/// @custom:link https://docs.soliditylang.org/en/v0.8.12/types.html#integers
/// @custom:link https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/math/SafeMath.sol
/// @custom:link Ethernaut level: https://ethernaut.openzeppelin.com/level/0x63bE8347A617476CA461649897238A31835a32CE
contract HackToken {
    mapping(address => uint8) balances;
    uint8 public totalSupply;

    constructor(uint8 initialSupply) {
        balances[msg.sender] = totalSupply = initialSupply;
    }

    function transfer(address to, uint8 value) external returns (bool) {
        unchecked {
            // ❌ Problem
            // require(balances[msg.sender] - value >= 0);
            // ✅ Audit recommendation:
            require(balances[msg.sender] >= value);

            balances[msg.sender] -= value;
            balances[to] += value;

            // 🗣 Logging status
            console.log("Require: ", balances[msg.sender] - value);
            console.log("msg.sender balance: ", balances[msg.sender]);
            console.log("to balance: ", balances[to]);
        }

        return true;
    }

    function balanceOf(address owner) external view returns (uint8 balance) {
        return balances[owner];
    }

    function setBalance(address owner, uint8 balance) external {
        balances[owner] = balance;
    }
}
