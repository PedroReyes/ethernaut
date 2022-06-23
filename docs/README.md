# Solidity API

## Greeter

You can use this contract for only the most basic simulation

_All function calls are currently implemented without side effects_

### greeting

```solidity
string greeting
```

_Variable - example of variable_

### constructor

```solidity
constructor(string _greeting) public
```

### greet

```solidity
function greet(uint256 rings) public view returns (string)
```

Calculate tree age in years, rounded up, for live trees

_The Alexandr N. Tetearing algorithm could increase precision_

| Name | Type | Description |
| ---- | ---- | ----------- |
| rings | uint256 | The number of rings from dendrochronological sample |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string | Age in years, rounded up for partial years |

### setGreeting

```solidity
function setGreeting(string _greeting) public
```

## Vault

😊 This contract is for those weak hands that cannot hold!!

_💻 This contract is used by contract A and B to establish/as a helper/etc . . ._

### ADMIN_ROLE

```solidity
bytes32 ADMIN_ROLE
```

_👨‍👩‍👦 Role-Based Access control - ADMIN role_

### SWEEPER_ROLE

```solidity
bytes32 SWEEPER_ROLE
```

_👨‍👩‍👦 Role-Based Access control - SWEEPER role_

### vaultDeposits

```solidity
mapping(address => struct Vault.VaultDeposit[]) vaultDeposits
```

_💸 Owner => Token => Deposit_

### VaultDeposit

```solidity
struct VaultDeposit {
  uint256 amount;
  uint256 lockEndTime;
  address token;
}
```

### feePercentage

```solidity
uint256 feePercentage
```

_💰 Income_

### feesCollectedPerToken

```solidity
mapping(address => uint256) feesCollectedPerToken
```

### constructor

```solidity
constructor() public
```

_🔨 We setup roles and an initial fee commision for each operation_

### deposit

```solidity
function deposit(address _token, uint256 _amount, uint256 _lockedTime) external payable
```

_✍ Write - User can make individual deposits that will be locked for a certain time_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _token | address | - ERC20 token address. address(0) if sending ether |
| _amount | uint256 | - bigger than zero if sending ERC20 tokens |
| _lockedTime | uint256 | - bigger than zero if sending ERC20 tokens. Example, 1 minute, 1 hour, 1 day |

### withdraw

```solidity
function withdraw(address _token, uint256 _amount, uint256 _depositIndex) external payable
```

_✍ Write - You can withdraw ERC20_

### sweep

```solidity
function sweep(address _token) public
```

_✍ Write - Sweep all the tokens from the vault_

### setFee

```solidity
function setFee(uint256 _fee) public
```

_✍ Write - Set the fee when user make a deposit_

### getFee

```solidity
function getFee(uint256 _amount) public view returns (uint256)
```

_👁‍🗨 Read - Get fee for an amount of tokens_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _amount | uint256 | - bigger than zero if sending ERC20 tokens |

### getUserDeposits

```solidity
function getUserDeposits(address user) external view returns (struct Vault.VaultDeposit[])
```

_👁‍🗨 Read - Get the deposits of a specific user_

### pause

```solidity
function pause() public
```

_👁‍🗨 Getter - Pause the smart contract_

### unpause

```solidity
function unpause() public
```

_👁‍🗨 Getter - Unpause the smart contract_

### Deposit

```solidity
event Deposit(address from, address token, uint256 value)
```

_📧 Event - Emitted when `value` tokens are moved from one account (`from`) to
another (`to`).

Note that `value` may be zero._

### Withdraw

```solidity
event Withdraw(address to, address token, uint256 value)
```

_📧 Event - Emitted when `value` tokens are moved from one account (`from`) to
another (`to`).

Note that `value` may be zero._

