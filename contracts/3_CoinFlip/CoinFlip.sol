// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

/// @title Ethernaut Contract
interface CoinFlip {
    function flip(bool _guess) external returns (bool);
}
