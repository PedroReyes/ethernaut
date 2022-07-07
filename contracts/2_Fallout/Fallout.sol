// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

contract Fallout {
    mapping(address => uint256) allocations;
    address payable public owner;

    /* constructor */
    function Fal1out() external payable {
        owner = payable(msg.sender);
        allocations[owner] = msg.value;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "caller is not the owner");
        _;
    }

    function allocate() external payable {
        allocations[msg.sender] = allocations[msg.sender] + (msg.value);
    }

    function sendAllocation(address payable allocator) external {
        require(allocations[allocator] > 0);
        allocator.transfer(allocations[allocator]);
    }

    function collectAllocations() external onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    function allocatorBalance(address allocator)
        external
        view
        returns (uint256)
    {
        return allocations[allocator];
    }
}
