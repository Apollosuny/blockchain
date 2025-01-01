// import { expect } from 'chai';
// import { ethers } from 'hardhat';

// describe('Swap', function () {
//   let swap: any;
//   let apolloToken: any;
//   let moonToken: any;
//   let owner: any;
//   let addr1: any;

//   beforeEach(async function () {
//     [owner, addr1] = await ethers.getSigners();

//     const MockERC20Factory = await ethers.getContractFactory('MockERC20');
//     apolloToken = await MockERC20Factory.deploy('Apollo Token', 'ATK');
//     moonToken = await MockERC20Factory.deploy('Moon Token', 'MTK');

//     await apolloToken.waitForDeployment();
//     await moonToken.waitForDeployment();

//     const apolloTokenAddress = await apolloToken.getAddress();
//     const moonTokenAddress = await moonToken.getAddress();

//     const SwapFactory = await ethers.getContractFactory('Swap');
//     swap = await SwapFactory.deploy(apolloTokenAddress, moonTokenAddress);
//     await swap.waitForDeployment();

//     await apolloToken.mint(owner.address, ethers.parseUnits('1000', 18));
//     await moonToken.mint(owner.address, ethers.parseUnits('1000', 18));

//     const swapAddress = await swap.getAddress();
//     await apolloToken
//       .connect(owner)
//       .approve(swapAddress, ethers.parseUnits('1000', 18));
//     await moonToken
//       .connect(owner)
//       .approve(swapAddress, ethers.parseUnits('1000', 18));
//   });

//   it('Should add liquidity correctly', async function () {
//     const amount0 = ethers.parseUnits('100', 18);
//     const amount1 = ethers.parseUnits('200', 18);

//     await swap.connect(owner).addLiquidity(amount0, amount1, true);

//     const swapAddress = await swap.getAddress();

//     const swapBalance0 = await apolloToken.balanceOf(swapAddress);
//     const swapBalance1 = await moonToken.balanceOf(swapAddress);

//     expect(swapBalance0).to.equal(amount0);
//     expect(swapBalance1).to.equal(amount1);

//     const lpBalance = await swap.balanceOf(owner.address);
//     expect(lpBalance).to.be.gt(0);
//   });
// });
