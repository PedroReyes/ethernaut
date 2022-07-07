// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

contract Token {
    mapping(address => uint256) balances;
    uint256 public constant TOTAL_SUPPLY = 1 ether;

    function transfer(address _to, uint256 _value) external returns (bool) {}

    function balanceOf(address _owner)
        external
        view
        returns (uint256 balance)
    {}

    function setBalance(address owner, uint256 balance) external {
        balances[owner] = balance;
    }
}
