// SPDX-License-Identifier: MIT
// pragma solidity ^0.5.0;
pragma solidity 0.8.18;

// import "../helpers/Ownable-05.sol";

// 📘 Alien codex explanation: https://coinsbench.com/19-alien-codex-ethernaut-explained-2ee090c89997
// 📘 Array storage layout: http://zxstudio.org/blog/2018/09/11/effectively-storing-arrays-in-solidity/
/**
 * Important note: To provide array-like storage, Solidity uses this trick: first, the array’s “main” slot
 * is allocated somewhere at the beginning of the storage, just as it is an uint256. Which means it gets a whole
 * storage slot by itself. There, the array length is stored. But since the array data’s size is unknown
 * (we’re talking about dynamic arrays here), Solidity authors needed to find somewhere safe to store it without
 * overlapping anything else. Well, actually, that’s impossible –
 * in theory, you can create two arrays of length > 2^128, and they will overlap, but since in practice,
 * you probably won’t, they came up with this simple trick: take a SHA3 hash of the array’s main slot number,
 * and use it as the starting address for array data. From there on, elements are stored sequentially,
 * occupying neighboring slots, if needed.
 */

contract AlienCodex { /* is Ownable */
    /*
    * Finally, solidity allows storage packing 
    * which allows multiple variables to be packed 
    * within the same storage slot 
    * (provided their combined size does not exceed 32 bytes
    */
    // address public owner; 20 bytes (slot 0)
    bool public contact; // 1 byte (slot 0)
    bytes32[] public codex; // (slot 1) - 32 bytes that
        // stores the length of the array,
        // the starting position of the array is keccak256(1),
        // that is, the hash of the slot number 1

    modifier contacted() {
        assert(contact);
        _;
    }

    function makeContact() public {
        contact = true;
    }

    function record(bytes32 _content) public contacted {
        codex.push(_content);
    }

    function retract() public contacted {
        // codex.length--;
    }

    function revise(uint256 i, bytes32 _content) public contacted {
        codex[i] = _content;
    }
}
