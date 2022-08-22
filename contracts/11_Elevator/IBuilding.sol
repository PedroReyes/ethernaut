// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

interface Building {
    // 👉 Prevent the issue: add "view" modifier to function declaration
    // function isLastFloor(uint256 _floor) external view/pure returns (bool);
    // This way the state within the contract implemeting Building is not modified.
    // 📕 https://docs.soliditylang.org/en/v0.8.15/cheatsheet.html#modifiers
    function isLastFloor(uint256) external returns (bool);
}
