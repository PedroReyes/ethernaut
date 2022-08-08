/**
 *Submitted for verification at BscScan.com on 2021-06-08
 */

pragma solidity =0.8.10;

// ----------------------------------------------------------------------------
// NBU token main contract (2020)
//
// Symbol       : NBU
// Name         : Nimbus
// Total supply : 1.000.000.000 (burnable)
// Decimals     : 18
// ----------------------------------------------------------------------------
// SPDX-License-Identifier: MIT
// ----------------------------------------------------------------------------

interface IBEP20 {
    function totalSupply() external view returns (uint256);

    function decimals() external view returns (uint8);

    function balanceOf(address account) external view returns (uint256);

    function transfer(address recipient, uint256 amount)
        external
        returns (bool);

    function allowance(address owner, address spender)
        external
        view
        returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    function getOwner() external view returns (address);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

contract Ownable {
    address public owner;
    address public newOwner;

    event OwnershipTransferred(address indexed from, address indexed to);

    constructor() {
        owner = msg.sender;
        emit OwnershipTransferred(address(0), owner);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Ownable: Caller is not the owner");
        _;
    }

    function transferOwnership(address transferOwner) external onlyOwner {
        require(transferOwner != newOwner);
        newOwner = transferOwner;
    }

    function acceptOwnership() public virtual {
        require(msg.sender == newOwner);
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
        newOwner = address(0);
    }
}

contract Pausable is Ownable {
    event Pause();
    event Unpause();

    bool public paused = false;

    modifier whenNotPaused() {
        require(!paused);
        _;
    }

    modifier whenPaused() {
        require(paused);
        _;
    }

    function pause() public onlyOwner whenNotPaused {
        paused = true;
        emit Pause();
    }

    function unpause() public onlyOwner whenPaused {
        paused = false;
        emit Unpause();
    }
}

contract NBU is IBEP20, Ownable, Pausable {
    mapping(address => mapping(address => uint256)) private _allowances;

    mapping(address => uint256) private _unfrozenBalances;

    mapping(address => uint256) private _vestingNonces;
    mapping(address => mapping(uint256 => uint256)) private _vestingAmounts;
    mapping(address => mapping(uint256 => uint256)) private _unvestedAmounts;
    mapping(address => mapping(uint256 => uint256)) private _vestingTypes; //0 - multivest, 1 - single vest, > 2 give by vester id
    mapping(address => mapping(uint256 => uint256))
        private _vestingReleaseStartDates;

    uint256 private _totalSupply = 1_000_000_000e18;
    string private constant _name = "Nimbus";
    string private constant _symbol = "NBU";
    uint8 private constant _decimals = 18;

    uint256 private constant vestingFirstPeriod = 60 days;
    uint256 private constant vestingSecondPeriod = 152 days;

    uint256 public giveAmount;
    mapping(address => bool) public vesters;

    bytes32 public immutable DOMAIN_SEPARATOR;
    bytes32 public constant PERMIT_TYPEHASH =
        keccak256(
            "Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"
        );
    mapping(address => uint256) public nonces;

    event Unvest(address indexed user, uint256 amount);

    constructor() {
        _unfrozenBalances[owner] = _totalSupply;
        emit Transfer(address(0), owner, _totalSupply);

        uint256 chainId = block.chainid;

        DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                keccak256(
                    "EIP712Domain(string name,uint256 chainId,address verifyingContract)"
                ),
                keccak256(bytes(_name)),
                chainId,
                address(this)
            )
        );
        giveAmount = _totalSupply / 10;
    }

    receive() external payable {
        revert();
    }

    function getOwner() public view override returns (address) {
        return owner;
    }

    function approve(address spender, uint256 amount)
        external
        override
        whenNotPaused
        returns (bool)
    {
        _approve(msg.sender, spender, amount);
        return true;
    }

    function transfer(address recipient, uint256 amount)
        external
        override
        whenNotPaused
        returns (bool)
    {
        _transfer(msg.sender, recipient, amount);
        return true;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external override whenNotPaused returns (bool) {
        _transfer(sender, recipient, amount);

        uint256 currentAllowance = _allowances[sender][msg.sender];
        require(
            currentAllowance >= amount,
            "NBU::transferFrom: transfer amount exceeds allowance"
        );
        _approve(sender, msg.sender, currentAllowance - amount);

        return true;
    }

    function permit(
        address owner,
        address spender,
        uint256 amount,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external whenNotPaused {
        bytes32 structHash = keccak256(
            abi.encode(
                PERMIT_TYPEHASH,
                owner,
                spender,
                amount,
                nonces[owner]++,
                deadline
            )
        );
        bytes32 digest = keccak256(
            abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR, structHash)
        );
        address signatory = ecrecover(digest, v, r, s);
        require(signatory != address(0), "NBU::permit: invalid signature");
        require(signatory == owner, "NBU::permit: unauthorized");
        require(block.timestamp <= deadline, "NBU::permit: signature expired");

        _allowances[owner][spender] = amount;

        emit Approval(owner, spender, amount);
    }

    function increaseAllowance(address spender, uint256 addedValue)
        external
        returns (bool)
    {
        _approve(
            msg.sender,
            spender,
            _allowances[msg.sender][spender] + addedValue
        );
        return true;
    }

    function decreaseAllowance(address spender, uint256 subtractedValue)
        external
        returns (bool)
    {
        uint256 currentAllowance = _allowances[msg.sender][spender];
        require(
            currentAllowance >= subtractedValue,
            "NBU::decreaseAllowance: decreased allowance below zero"
        );
        _approve(msg.sender, spender, currentAllowance - subtractedValue);

        return true;
    }

    function unvest() external whenNotPaused returns (uint256 unvested) {
        require(_vestingNonces[msg.sender] > 0, "NBU::unvest:No vested amount");
        for (uint256 i = 1; i <= _vestingNonces[msg.sender]; i++) {
            if (
                _vestingAmounts[msg.sender][i] ==
                _unvestedAmounts[msg.sender][i]
            ) continue;
            if (_vestingReleaseStartDates[msg.sender][i] > block.timestamp)
                break;
            uint256 toUnvest = ((block.timestamp -
                _vestingReleaseStartDates[msg.sender][i]) *
                _vestingAmounts[msg.sender][i]) / vestingSecondPeriod;
            if (toUnvest > _vestingAmounts[msg.sender][i]) {
                toUnvest = _vestingAmounts[msg.sender][i];
            }
            uint256 totalUnvestedForNonce = toUnvest;
            toUnvest -= _unvestedAmounts[msg.sender][i];
            unvested += toUnvest;
            _unvestedAmounts[msg.sender][i] = totalUnvestedForNonce;
        }
        _unfrozenBalances[msg.sender] += unvested;
        emit Unvest(msg.sender, unvested);
    }

    function give(
        address user,
        uint256 amount,
        uint256 vesterId
    ) external {
        require(giveAmount > amount, "NBU::give: give finished");
        require(vesters[msg.sender], "NBU::give: not vester");
        giveAmount -= amount;
        _vest(user, amount, vesterId);
    }

    function vest(address user, uint256 amount) external {
        require(vesters[msg.sender], "NBU::vest: not vester");
        _vest(user, amount, 1);
    }

    function burnTokens(uint256 amount)
        external
        onlyOwner
        returns (bool success)
    {
        require(
            amount <= _unfrozenBalances[owner],
            "NBU::burnTokens: exceeds available amount"
        );

        uint256 ownerBalance = _unfrozenBalances[owner];
        require(
            ownerBalance >= amount,
            "NBU::burnTokens: burn amount exceeds owner balance"
        );

        _unfrozenBalances[owner] = ownerBalance - amount;
        _totalSupply -= amount;
        emit Transfer(owner, address(0), amount);
        return true;
    }

    function allowance(address owner, address spender)
        external
        view
        override
        returns (uint256)
    {
        return _allowances[owner][spender];
    }

    function decimals() external pure override returns (uint8) {
        return _decimals;
    }

    function name() external pure returns (string memory) {
        return _name;
    }

    function symbol() external pure returns (string memory) {
        return _symbol;
    }

    function totalSupply() external view override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account)
        external
        view
        override
        returns (uint256)
    {
        uint256 amount = _unfrozenBalances[account];
        if (_vestingNonces[account] == 0) return amount;
        for (uint256 i = 1; i <= _vestingNonces[account]; i++) {
            amount =
                amount +
                _vestingAmounts[account][i] -
                _unvestedAmounts[account][i];
        }
        return amount;
    }

    function availableForUnvesting(address user)
        external
        view
        returns (uint256 unvestAmount)
    {
        if (_vestingNonces[user] == 0) return 0;
        for (uint256 i = 1; i <= _vestingNonces[user]; i++) {
            if (_vestingAmounts[user][i] == _unvestedAmounts[user][i]) continue;
            if (_vestingReleaseStartDates[user][i] > block.timestamp) break;
            uint256 toUnvest = ((block.timestamp -
                _vestingReleaseStartDates[user][i]) *
                _vestingAmounts[user][i]) / vestingSecondPeriod;
            if (toUnvest > _vestingAmounts[user][i]) {
                toUnvest = _vestingAmounts[user][i];
            }
            toUnvest -= _unvestedAmounts[user][i];
            unvestAmount += toUnvest;
        }
    }

    function availableForTransfer(address account)
        external
        view
        returns (uint256)
    {
        return _unfrozenBalances[account];
    }

    function vestingInfo(address user, uint256 nonce)
        external
        view
        returns (
            uint256 vestingAmount,
            uint256 unvestedAmount,
            uint256 vestingReleaseStartDate,
            uint256 vestType
        )
    {
        vestingAmount = _vestingAmounts[user][nonce];
        unvestedAmount = _unvestedAmounts[user][nonce];
        vestingReleaseStartDate = _vestingReleaseStartDates[user][nonce];
        vestType = _vestingTypes[user][nonce];
    }

    function vestingNonces(address user)
        external
        view
        returns (uint256 lastNonce)
    {
        return _vestingNonces[user];
    }

    function _approve(
        address owner,
        address spender,
        uint256 amount
    ) private {
        require(
            owner != address(0),
            "NBU::_approve: approve from the zero address"
        );
        require(
            spender != address(0),
            "NBU::_approve: approve to the zero address"
        );

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    function _transfer(
        address sender,
        address recipient,
        uint256 amount
    ) private {
        require(
            sender != address(0),
            "NBU::_transfer: transfer from the zero address"
        );
        require(
            recipient != address(0),
            "NBU::_transfer: transfer to the zero address"
        );

        uint256 senderAvailableBalance = _unfrozenBalances[sender];
        require(
            senderAvailableBalance >= amount,
            "NBU::_transfer: amount exceeds available for transfer balance"
        );
        _unfrozenBalances[sender] = senderAvailableBalance - amount;
        _unfrozenBalances[recipient] += amount;

        emit Transfer(sender, recipient, amount);
    }

    function _vest(
        address user,
        uint256 amount,
        uint256 vestType
    ) private {
        require(user != address(0), "NBU::_vest: vest to the zero address");
        uint256 nonce = ++_vestingNonces[user];
        _vestingAmounts[user][nonce] = amount;
        _vestingReleaseStartDates[user][nonce] =
            block.timestamp +
            vestingFirstPeriod;
        _unfrozenBalances[owner] -= amount;
        _vestingTypes[user][nonce] = vestType;
        emit Transfer(owner, user, amount);
    }

    function multisend(address[] memory to, uint256[] memory values)
        external
        onlyOwner
        returns (uint256)
    {
        require(to.length == values.length);
        require(to.length < 100);
        uint256 sum;
        for (uint256 j; j < values.length; j++) {
            sum += values[j];
        }
        _unfrozenBalances[owner] -= sum;
        for (uint256 i; i < to.length; i++) {
            _unfrozenBalances[to[i]] += values[i];
            emit Transfer(owner, to[i], values[i]);
        }
        return (to.length);
    }

    function multivest(address[] memory to, uint256[] memory values)
        external
        onlyOwner
        returns (uint256)
    {
        require(to.length == values.length);
        require(to.length < 100);
        uint256 sum;
        for (uint256 j; j < values.length; j++) {
            sum += values[j];
        }
        _unfrozenBalances[owner] -= sum;
        for (uint256 i; i < to.length; i++) {
            uint256 nonce = ++_vestingNonces[to[i]];
            _vestingAmounts[to[i]][nonce] = values[i];
            _vestingReleaseStartDates[to[i]][nonce] =
                block.timestamp +
                vestingFirstPeriod;
            _vestingTypes[to[i]][nonce] = 0;
            emit Transfer(owner, to[i], values[i]);
        }
        return (to.length);
    }

    function updateVesters(address vester, bool isActive) external onlyOwner {
        vesters[vester] = isActive;
    }

    function updateGiveAmount(uint256 amount) external onlyOwner {
        require(
            _unfrozenBalances[owner] > amount,
            "NBU::updateGiveAmount: exceed owner balance"
        );
        giveAmount = amount;
    }

    function transferAnyBEP20Token(address tokenAddress, uint256 tokens)
        external
        onlyOwner
        returns (bool success)
    {
        return IBEP20(tokenAddress).transfer(owner, tokens);
    }

    function acceptOwnership() public override {
        uint256 amount = _unfrozenBalances[owner];
        _unfrozenBalances[newOwner] = amount;
        _unfrozenBalances[owner] = 0;
        emit Transfer(owner, newOwner, amount);
        super.acceptOwnership();
    }
}
