// import { expect } from 'chai';
// import { ethers } from 'hardhat';
// import {
//   loadFixture,
//   time,
// } from '@nomicfoundation/hardhat-toolbox/network-helpers';
// import { MockERC20, FarmContract } from '../typechain-types';

// describe('FarmContract', function () {
//   let stakingToken: MockERC20;
//   let farmContract: FarmContract;
//   let owner: any, user1: any, user2: any;

//   beforeEach(async function () {
//     // Deploy ERC20 Mock Token
//     const MockERC20Factory = await ethers.getContractFactory('MockERC20');
//     stakingToken = (await MockERC20Factory.deploy(
//       'Mock Token',
//       'MTK',
//       18,
//       ethers.parseEther('100000')
//     )) as MockERC20;
//     await stakingToken.waitForDeployment();

//     // Deploy Farm Contract
//     const FarmContractFactory = await ethers.getContractFactory('FarmContract');
//     const stakingAddress = await stakingToken.getAddress();
//     farmContract = (await FarmContractFactory.deploy(
//       stakingAddress,
//       ethers.parseEther('1') // rewardPerSecond = 1 token/second
//     )) as FarmContract;
//     await farmContract.waitForDeployment();

//     [owner, user1, user2] = await ethers.getSigners();

//     // Transfer tokens to user1 for staking
//     const user1Address = await user1.getAddress();
//     const user2Address = await user2.getAddress();
//     await stakingToken.transfer(user1Address, ethers.parseEther('1000'));
//     await stakingToken.transfer(user2Address, ethers.parseEther('1000'));
//   });

//   it('should calculate correct reward after staking', async function () {
//     // User1 approves and stakes 100 tokens
//     const farmAddress = await farmContract.getAddress();
//     await stakingToken
//       .connect(user1)
//       .approve(farmAddress, ethers.parseEther('100'));
//     await farmContract.connect(user1).stake(ethers.parseEther('100'));

//     // Simulate 10 seconds passing
//     await time.increase(10);

//     // User1 claims rewards
//     const user1Address = await user1.getAddress();
//     const initialBalance = await stakingToken.balanceOf(user1Address);
//     console.log('Initial Balance:', initialBalance.toString());

//     const rewardPerTokenBeforeClaim = await farmContract.rewardPerToken();
//     console.log(
//       'Reward Per Token Before Claim:',
//       rewardPerTokenBeforeClaim.toString()
//     );

//     await farmContract.connect(user1).claimRewards();

//     const rewardPerTokenAfterClaim = await farmContract.rewardPerToken();
//     console.log(
//       'Reward Per Token After Claim:',
//       rewardPerTokenAfterClaim.toString()
//     );

//     const finalBalance = await stakingToken.balanceOf(user1Address);
//     console.log('Final Balance:', finalBalance.toString());

//     // Expected reward: rewardPerSecond (1) * 10 seconds = 10 tokens
//     const reward = ethers.parseEther('11');
//     expect(finalBalance - initialBalance).to.equal(reward);
//   });

//   // it('should correctly handle multiple users staking and withdrawing', async function () {
//   //   // User1 approves and stakes 100 tokens
//   //   const farmAddress = await farmContract.getAddress();
//   //   await stakingToken
//   //     .connect(user1)
//   //     .approve(farmAddress, ethers.parseEther('100'));
//   //   await farmContract.connect(user1).stake(ethers.parseEther('100'));

//   //   // Simulate 10 seconds passing
//   //   await time.increase(10); // Increase time by 10 seconds

//   //   // User2 approves and stakes 50 tokens (half of User1's stake)
//   //   await stakingToken
//   //     .connect(user2)
//   //     .approve(farmAddress, ethers.parseEther('50'));
//   //   await farmContract.connect(user2).stake(ethers.parseEther('50'));

//   //   // Simulate another 10 seconds passing
//   //   await time.increase(10); // Increase time by another 10 seconds

//   //   // User2 withdraws 25 tokens (half of what they staked)
//   //   await farmContract.connect(user2).withdraw(ethers.parseEther('25'));

//   //   // Check the initial and final balances
//   //   const user1Address = await user1.getAddress();
//   //   const user2Address = await user2.getAddress();

//   //   const initialBalanceUser1 = await stakingToken.balanceOf(user1Address);
//   //   const initialBalanceUser2 = await stakingToken.balanceOf(user2Address);

//   //   console.log('Initial Balance User1:', initialBalanceUser1.toString());
//   //   console.log('Initial Balance User2:', initialBalanceUser2.toString());

//   //   // User1 has staked 100 tokens and received rewards after 20 seconds.
//   //   const rewardUser1 = ethers.parseEther('20'); // 20 seconds * 1 token/second

//   //   // User2 has staked 50 tokens for 10 seconds and 25 tokens for another 10 seconds.
//   //   const rewardUser2 = ethers.parseEther('10'); // 50 tokens * 10 seconds * 1 reward per second
//   //   const rewardUser2AfterWithdraw = ethers.parseEther('5'); // 25 tokens * 10 seconds * 1 reward per second

//   //   // Final balances
//   //   await farmContract.connect(user1).claimRewards();
//   //   await farmContract.connect(user2).claimRewards();

//   //   const finalBalanceUser1 = await stakingToken.balanceOf(user1Address);
//   //   const finalBalanceUser2 = await stakingToken.balanceOf(user2Address);

//   //   console.log('Final Balance User1:', finalBalanceUser1.toString());
//   //   console.log('Final Balance User2:', finalBalanceUser2.toString());

//   //   // Check if the rewards are correct
//   //   expect(finalBalanceUser1 - initialBalanceUser1).to.equal(rewardUser1);
//   //   expect(finalBalanceUser2 - initialBalanceUser2).to.equal(
//   //     rewardUser2 + rewardUser2AfterWithdraw
//   //   );
//   // });
// });
