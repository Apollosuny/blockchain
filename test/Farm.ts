import { expect } from 'chai';
import { ethers } from 'hardhat';
import {
  loadFixture,
  time,
} from '@nomicfoundation/hardhat-toolbox/network-helpers';
import { MockERC20, FarmContract } from '../typechain-types';

describe('FarmContract', function () {
  let stakingToken: MockERC20;
  let farmContract: FarmContract;
  let owner: any, user1: any;

  beforeEach(async function () {
    // Deploy ERC20 Mock Token
    const MockERC20Factory = await ethers.getContractFactory('MockERC20');
    stakingToken = (await MockERC20Factory.deploy(
      'Mock Token',
      'MTK',
      18,
      ethers.parseEther('100000')
    )) as MockERC20;
    await stakingToken.waitForDeployment();

    // Deploy Farm Contract
    const FarmContractFactory = await ethers.getContractFactory('FarmContract');
    const stakingAddress = await stakingToken.getAddress();
    farmContract = (await FarmContractFactory.deploy(
      stakingAddress,
      ethers.parseEther('1') // rewardPerSecond = 1 token/second
    )) as FarmContract;
    await farmContract.waitForDeployment();

    [owner, user1] = await ethers.getSigners();

    // Transfer tokens to user1 for staking
    const user1Address = await user1.getAddress();
    await stakingToken.transfer(user1Address, ethers.parseEther('1000'));
  });

  it('should calculate correct reward after staking', async function () {
    // User1 approves and stakes 100 tokens
    const farmAddress = await farmContract.getAddress();
    await stakingToken
      .connect(user1)
      .approve(farmAddress, ethers.parseEther('100'));
    await farmContract.connect(user1).stake(ethers.parseEther('100'));

    // Simulate 10 seconds passing
    await time.increase(10);

    // User1 claims rewards
    const user1Address = await user1.getAddress();
    const initialBalance = await stakingToken.balanceOf(user1Address);
    console.log('Initial Balance:', initialBalance.toString());

    const rewardPerTokenBeforeClaim = await farmContract.rewardPerToken();
    console.log(
      'Reward Per Token Before Claim:',
      rewardPerTokenBeforeClaim.toString()
    );

    await farmContract.connect(user1).claimRewards();

    const rewardPerTokenAfterClaim = await farmContract.rewardPerToken();
    console.log(
      'Reward Per Token After Claim:',
      rewardPerTokenAfterClaim.toString()
    );

    const finalBalance = await stakingToken.balanceOf(user1Address);
    console.log('Final Balance:', finalBalance.toString());

    // Expected reward: rewardPerSecond (1) * 10 seconds = 10 tokens
    const reward = ethers.parseEther('11');
    expect(finalBalance - initialBalance).to.equal(reward);
  });
});
