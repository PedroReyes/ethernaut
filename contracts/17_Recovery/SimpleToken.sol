// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract SimpleToken {
    using SafeMath for uint256;
    // public variables
    string public name;
    mapping(address => uint256) public balances;

    // constructor
    constructor(
        string memory _name,
        address _creator,
        uint256 _initialSupply
    ) {
        name = _name;
        balances[_creator] = _initialSupply;
    }

    // collect ether in return for tokens
    receive() external payable {
        balances[msg.sender] = msg.value.mul(10);
    }

    // allow transfers of tokens
    function transfer(address _to, uint256 _amount) public {
        require(balances[msg.sender] >= _amount);
        balances[msg.sender] = balances[msg.sender].sub(_amount);
        balances[_to] = _amount;
    }

    // Need to understand what happens here: https://goerli.etherscan.io/tx/0xc4e250b5472c9466c058d2eb15030c69718a09ed1e48a2ab8aa6a6a604ffb65c
    // clean up after ourselves
    function destroy(address payable _to) public {
        // 📖 https://docs.soliditylang.org/en/v0.8.13/introduction-to-smart-contracts.html#deactivate-and-self-destruct
        selfdestruct(_to);
    }
}
