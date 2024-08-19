// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

/// @title Binary Coin Token (BNRY)
/// @notice This contract implements the Binary Coin (BNRY) token with burnable, permit, and voting functionalities.
/// @dev This contract uses OpenZeppelin's ERC20, ERC20Burnable, ERC20Permit, and ERC20Votes implementations.
/// @dev The token has an initial supply of 10 billion tokens, all minted to the provided admin address.
contract BNRYToken is ERC20, ERC20Burnable, ERC20Permit, ERC20Votes {
    /// @notice The initial supply of BNRY tokens.
    uint256 internal constant INITIAL_SUPPLY = 10_000_000_000 * 10 ** 18;

    /// @notice Constructor to create the BNRY token.
    /// @param _admin The address of the admin who will receive the initial supply.
    /// @dev The admin address cannot be the zero address.
    constructor(address _admin) ERC20("Binary Token", "BNRY") ERC20Permit("Binary Token") {
        require(_admin != address(0), "ADDRESS_ZERO");
        _mint(_admin, INITIAL_SUPPLY);
    }

    /// @notice Handles post-transfer logic required for ERC20Votes.
    /// @inheritdoc ERC20
    function _afterTokenTransfer(address from, address to, uint256 amount) internal override(ERC20, ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }

    /// @notice Handles minting logic required for ERC20Votes.
    /// @inheritdoc ERC20
    function _mint(address to, uint256 amount) internal override(ERC20, ERC20Votes) {
        super._mint(to, amount);
    }

    /// @notice Handles burning logic required for ERC20Votes.
    /// @inheritdoc ERC20
    function _burn(address account, uint256 amount) internal override(ERC20, ERC20Votes) {
        super._burn(account, amount);
    }
}