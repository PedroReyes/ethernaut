// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

contract Token {
    mapping(address => uint256) balances;
    uint256 public totalSupply;

    function transfer(address _to, uint256 _value) public returns (bool) {}

    function balanceOf(address _owner) public view returns (uint256 balance) {}

    function setBalance(address _owner, uint256 _balance) public {}
}
