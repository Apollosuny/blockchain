// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract FarmContract {
    using Strings for uint256;

    IERC20 public stakingToken;
    address public owner;
    uint256 public totalStaked;
    uint256 public rewardPerSecond;
    uint256 public rewardPerToken;
    uint256 public lastUpdateRewardTime;

    struct UserInfo {
        uint256 amount;
        uint256 rewardDebt;
    }
    mapping(address => UserInfo) public userInfo;

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 reward);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    constructor(IERC20 _stakingToken, uint256 _rewardPerSecond) {
        owner = msg.sender;
        stakingToken = IERC20(_stakingToken);
        rewardPerSecond = _rewardPerSecond;
        lastUpdateRewardTime = block.timestamp;
    }

    function updatePool() public {
        if (block.timestamp < lastUpdateRewardTime) return;
        uint256 timePassed = block.timestamp - lastUpdateRewardTime;

        if (totalStaked > 0) {
            uint256 reward = (rewardPerSecond * timePassed * 1e18) /
                totalStaked;
            rewardPerToken += reward;
        }
        lastUpdateRewardTime = block.timestamp;
    }

    function stake(uint256 _amount) external {
        updatePool();
        UserInfo storage user = userInfo[msg.sender];
        if (user.amount > 0) {
            uint256 totalReward = (user.amount * rewardPerToken) / 1e18;
            uint256 availableReward = totalReward - user.rewardDebt;
            if (availableReward > 0) {
                stakingToken.transfer(msg.sender, availableReward);
            }
        }
        stakingToken.transferFrom(msg.sender, address(this), _amount);
        user.amount += _amount;
        user.rewardDebt = (user.amount * rewardPerToken) / 1e18;
        totalStaked += _amount;

        emit Staked(msg.sender, _amount);
    }

    function withdraw(uint256 _amount) external {
        UserInfo storage user = userInfo[msg.sender];
        require(user.amount >= _amount, "Insufficient balance");
        updatePool();

        uint256 totalReward = (user.amount * rewardPerToken) / 1e18 -
            user.rewardDebt;
        stakingToken.transfer(msg.sender, totalReward);

        user.amount -= _amount;
        user.rewardDebt = (user.amount * rewardPerToken) / 1e18;
        totalStaked -= _amount;

        emit Withdrawn(msg.sender, _amount);
    }

    function claimRewards() external {
        UserInfo storage user = userInfo[msg.sender];
        updatePool();
        uint256 totalReward = ((user.amount * rewardPerToken) / 1e18) -
            user.rewardDebt;
        require(totalReward > 0, "No rewards available");
        stakingToken.transfer(msg.sender, totalReward);
        user.rewardDebt = (user.amount * rewardPerToken) / 1e18;

        emit RewardClaimed(msg.sender, totalReward);
    }
}
