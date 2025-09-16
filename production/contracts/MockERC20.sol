// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/**
 * @title MockERC20
 * @dev Simple ERC20 token for testing deployments and interactions
 */
contract MockERC20 {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor(string memory _name, string memory _symbol, uint8 _decimals) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
    }

    function _transfer(address from, address to, uint256 value) internal {
        require(to != address(0), "Transfer to zero address");
        require(balanceOf[from] >= value, "Insufficient balance");
        unchecked {
            balanceOf[from] -= value;
            balanceOf[to] += value;
        }
        emit Transfer(from, to, value);
    }

    function transfer(address to, uint256 value) external returns (bool) {
        _transfer(msg.sender, to, value);
        return true;
    }

    function approve(address spender, uint256 value) external returns (bool) {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) external returns (bool) {
        uint256 allowed = allowance[from][msg.sender];
        require(allowed >= value, "Allowance exceeded");
        if (allowed != type(uint256).max) {
            allowance[from][msg.sender] = allowed - value;
        }
        _transfer(from, to, value);
        return true;
    }

    function mint(address to, uint256 value) external returns (bool) {
        require(to != address(0), "Mint to zero address");
        totalSupply += value;
        balanceOf[to] += value;
        emit Transfer(address(0), to, value);
        return true;
    }

    function burn(address from, uint256 value) external returns (bool) {
        require(balanceOf[from] >= value, "Burn exceeds balance");
        balanceOf[from] -= value;
        totalSupply -= value;
        emit Transfer(from, address(0), value);
        return true;
    }
}


