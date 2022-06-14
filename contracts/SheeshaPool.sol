//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SheeshaPool is ReentrancyGuard, Ownable {

    event Invested(
        address indexed user,
        uint256 amount
    );

    event Claimed(
        address indexed user,
        uint256 amount
    );

    struct UserInvestingData {
        uint256 amountInvested;
    }

    IERC20 public investingToken;

    mapping(address => UserInvestingData) investingDataByUser;

    constructor(
        address _investingToken
    )
    Ownable()
    {
        investingToken = IERC20(_investingToken);
    }

    function invest(uint256 _amount) external {
        require(_amount > 0, "Minimum amount not met");

        require(
            investingToken.transferFrom(msg.sender, address(this), _amount),
            "Cannot transfer balance"
        );

        UserInvestingData storage userInvestingData = investingDataByUser[msg.sender];

        userInvestingData.amountInvested += _amount;
        emit Invested(msg.sender, _amount);
    }

    function claim(uint256 _amount) external {
        require(_amount > 0, "Minimum amount not met");
        UserInvestingData storage userInvestingData = investingDataByUser[msg.sender];

        uint256 finaAmount = 0;
        if (userInvestingData.amountInvested >= _amount) {
            finaAmount = _amount;
            userInvestingData.amountInvested -= _amount;

        } else {
            finaAmount = userInvestingData.amountInvested;
            userInvestingData.amountInvested = 0;
        }

        require(
            investingToken.transferFrom(address(this),msg.sender, finaAmount),
            "Cannot transfer balance"
        );

        emit Claimed(msg.sender, finaAmount);
    }

    function balance() external view returns (uint256 amount) {
        UserInvestingData storage userInvestingData = investingDataByUser[msg.sender];
        amount = userInvestingData.amountInvested;
    }
}