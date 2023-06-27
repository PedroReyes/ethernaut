// SPDX-License-Identifier: MIT
// pragma solidity ^0.5.0;
pragma solidity 0.8.18;

contract Ethernaut {
    struct EmittedInstanceData {
        address player;
        address level;
        bool completed;
    }

    mapping(address => EmittedInstanceData) public emittedInstances;

    function submitLevelInstance(address payable _instance) external {
        // solhint-disable
    }

    function createLevelInstance(address _level) external {
        // solhint-disable
    }
}
