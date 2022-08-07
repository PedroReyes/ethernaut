// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "hardhat/console.sol";

contract Reentrance is ReentrancyGuard {
    using SafeMath for uint256;
    mapping(address => uint256) public balances;

    function donate(address _to) public payable {
        balances[_to] = balances[_to] + msg.value;
    }

    function balanceOf(address _who) public view returns (uint256 balance) {
        return balances[_who];
    }

    // 👉 Adding nonReentrant modifier
    function withdraw(uint256 _amount) public /*nonReentrant*/
    {
        console.log("--> Contract balance: %s", address(this).balance);
        if (balances[msg.sender] >= _amount) {
            // 👉 Solidity 0.6.0 ✅ Safe - Order matters!!
            // unchecked {
            //     balances[msg.sender] -= _amount;
            // }

            (bool result, ) = msg.sender.call{value: _amount}("");
            if (result) {
                _amount;
            }
            // 👉 Use SafeMath to will prevent arithmetic overflow and underflow
            // Solidity ^0.8 default behaviour is throwing an error for overflow / underflow
            // Solidity 0.8.10 ✅ Safe - Update the state before calling the msg.sender.call
            // balances[msg.sender] -= _amount;

            // 👉 Solidity 0.6.0 ❌ Not safe
            // Use SafeMath to prevent arithmetic overflow and underflow
            // and check the result of the operation
            unchecked {
                balances[msg.sender] -= _amount;
            }

            // 👉 Solidity 0.6.0 ❌ Not safe
            // Use SafeMath to prevent arithmetic overflow and underflow
            // and check the result of the operation
            // balances[msg.sender].trySub(_amount);

            console.log(
                "Withdrawal complete --> \nBalances: %s \nContract balance: %s\n",
                balances[msg.sender],
                address(this).balance
            );
        } else {
            console.log("No balance for address %s", msg.sender);
        }
    }

    function withdraw2(uint256 _amount) public {
        balances[msg.sender] -= _amount;
    }

    receive() external payable {}
}
