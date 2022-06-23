//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

/// @title A simulator for trees
/// @author Larry A. Gardner
/// @notice You can use this contract for only the most basic simulation
/// @dev All function calls are currently implemented without side effects
/// @custom:experimental This is an experimental contract.
contract Greeter {
    /// @dev Variable - example of variable
    string private greeting;

    constructor(string memory _greeting) {
        greeting = _greeting;
    }

    /// @notice Calculate tree age in years, rounded up, for live trees
    /// @dev The Alexandr N. Tetearing algorithm could increase precision
    /// @return Age in years, rounded up for partial years
    function greet() public view returns (string memory) {
        return greeting;
    }

    function setGreeting(string memory _greeting) public {
        greeting = _greeting;
    }
}
