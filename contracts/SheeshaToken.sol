//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SheeshaToken is ERC20 {
    uint256 constant _initial_supply = 1000 * (10**18);
    constructor() ERC20("ShTkn", "ShTkn") {
        _mint(msg.sender, _initial_supply);
    }

}