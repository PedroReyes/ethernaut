// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/// @title A vault for storing ether and tokens
/// @author Pedro Reyes
/// @notice This contract is for those weak hands that cannot hold!!
contract Vault is AccessControlEnumerable, Pausable {
    // 👨‍👩‍👦 Role-Based Access control
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant SWEEPER_ROLE = keccak256("SWEEPER_ROLE");

    // 💸 Owner => Token => Deposit
    mapping(address => VaultDeposit[]) public vaultDeposits;

    struct VaultDeposit {
        uint256 amount;
        uint256 lockEndTime;
        address token;
    }

    // 💰 Income
    uint256 public feePercentage;
    mapping(address => uint256) public feesCollectedPerToken;

    // 🔨
    constructor() {
        // Grant the contract deployer the default admin role: it will be able
        // to grant and revoke any roles
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);

        // Grant the admin role to a specified account
        _setupRole(ADMIN_ROLE, msg.sender);
        _setupRole(SWEEPER_ROLE, msg.sender);

        feePercentage = 15; //  0.15%
    }

    /// @dev User can make individual deposits that will be locked for a certain time
    /// @param _token - ERC20 token address. address(0) if sending ether
    /// @param _amount - bigger than zero if sending ERC20 tokens
    /// @param _lockedTime - bigger than zero if sending ERC20 tokens. Example, 1 minute, 1 hour, 1 day
    function deposit(
        address _token,
        uint256 _amount,
        uint256 _lockedTime
    ) external payable whenNotPaused {
        require(msg.sender != address(0), "Vault already has an onwer");
        require(_token != address(0), "Token provided not valid");
        require(_amount > 0, "Amount to deposit must be bigger than zero");
        require(_lockedTime > 0, "Locked time must be bigger than zero");

        uint256 fee = getFee(_amount);
        require(fee > 0, "Token amount provided is too small");
        feesCollectedPerToken[_token] += fee;

        VaultDeposit memory newUserDeposit;
        newUserDeposit.token = _token;
        newUserDeposit.amount = _amount;
        newUserDeposit.lockEndTime = block.timestamp + _lockedTime;
        vaultDeposits[msg.sender].push(newUserDeposit);

        IERC20(_token).transferFrom(msg.sender, address(this), _amount + fee);

        emit Deposit(msg.sender, _token, _amount);
    }

    /// @dev Get fee for an amount of tokens
    /// @param _amount - bigger than zero if sending ERC20 tokens
    function getFee(uint256 _amount) public view returns (uint256) {
        return (_amount * feePercentage) / 10000;
    }

    /// @dev You can withdraw ERC20
    function withdraw(
        address _token,
        uint256 _amount,
        uint256 _depositIndex
    ) external payable whenNotPaused {
        VaultDeposit storage userDeposit = vaultDeposits[msg.sender][
            _depositIndex
        ];

        require(
            _token == userDeposit.token,
            "Incorrect token address provided"
        );
        require(
            _amount <= userDeposit.amount,
            "Amount to withdraw exceeds deposit amount"
        );
        require(
            block.timestamp >= userDeposit.lockEndTime,
            "Deposit not available"
        );

        uint256 fee = getFee(_amount);
        require(fee > 0, "Token amount provided is too small");
        feesCollectedPerToken[_token] += fee;
        IERC20(_token).transferFrom(msg.sender, address(this), fee);

        userDeposit.amount -= _amount;
        IERC20(_token).transfer(msg.sender, _amount);

        emit Withdraw(msg.sender, _token, _amount);
    }

    /// @dev Set the fee when user make a deposit
    function setFee(uint256 _fee) public {
        // Check that the calling account has the minter role
        require(hasRole(ADMIN_ROLE, msg.sender), "Caller is not ADMIN_ROLE");

        feePercentage = _fee;
    }

    /// @dev Sweep all the tokens from the vault
    // TODO: Next version add an address that will be the recipient of the sweep
    function sweep(address _token) public {
        require(
            hasRole(SWEEPER_ROLE, msg.sender),
            "Caller is not SWEEPER_ROLE"
        );

        uint256 feesCollected = feesCollectedPerToken[_token];
        if (feesCollected > 0) {
            feesCollectedPerToken[_token] = 0;
            IERC20(_token).transfer(msg.sender, feesCollected);
        }
    }

    /// @dev Get the deposits of a specific user
    function getUserDeposits(address user)
        external
        view
        returns (VaultDeposit[] memory)
    {
        return vaultDeposits[user];
    }

    /// @dev Pause the smart contract
    function pause() public onlyRole(ADMIN_ROLE) {
        _pause();
    }

    /// @dev Unpause the smart contract
    function unpause() public onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    // 📧 Events
    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Deposit(address indexed from, address token, uint256 value);

    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Withdraw(address indexed to, address token, uint256 value);

    /// @dev this contract should not receive ether directly from a wallet.
    /// The only way to receive ether should be via the deposit method.
    // receive() external payable{}
    // fallback() external payable{}
}
