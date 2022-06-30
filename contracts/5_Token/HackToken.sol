// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "hardhat/console.sol";

/// @title Contract for hacking Token.sol from Ethernaut
/// @author Pedro Reyes
/// @custom:link https://docs.soliditylang.org/en/v0.8.12/types.html#integers
/// @custom:link https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/math/SafeMath.sol
/// @custom:link Ethernaut level: https://ethernaut.openzeppelin.com/level/0x63bE8347A617476CA461649897238A31835a32CE
contract HackToken {
    mapping(address => uint8) balances;
    uint8 public totalSupply;

    constructor(uint8 _initialSupply) {
        balances[msg.sender] = totalSupply = _initialSupply;
    }

    function transfer(address _to, uint8 _value) public returns (bool) {
        unchecked {
            require(balances[msg.sender] - _value >= 0);
            balances[msg.sender] -= _value;
            balances[_to] += _value;

            // 🗣 Logging status
            console.log("Require: ", balances[msg.sender] - _value);
            console.log("msg.sender balance: ", balances[msg.sender]);
            console.log("to balance: ", balances[_to]);
        }

        return true;
    }

    function balanceOf(address _owner) public view returns (uint8 balance) {
        return balances[_owner];
    }

    function setBalance(address _owner, uint8 _balance) public {
        balances[_owner] = _balance;
    }
}
