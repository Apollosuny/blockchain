import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('Swap', function () {
  let swap: any;
  let apolloToken: any;
  let moonToken: any;
  let owner: any;
  let addr1: any;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    const ERC20Factory = await ethers.getContractFactory('ERC20');
    apolloToken = (await ERC20Factory.deploy('Apollo Token', 'ATK')) as any;
    moonToken = (await ERC20Factory.deploy('Moon Token', 'MTK')) as any;

    await apolloToken.deployed();
    await moonToken.deployed();

    const SwapFactory = await ethers.getContractFactory('Swap');
    swap = (await SwapFactory.deploy(
      apolloToken.address,
      moonToken.address
    )) as any;
    await swap.deployed();

    await apolloToken.mint(owner.address, ethers.parseUnits('1000', 18));
    await moonToken.mint(owner.address, ethers.parseUnits('1000', 18));

    await apolloToken
      .connect(owner)
      .approve(swap.address, ethers.parseUnits('1000', 18));
    await moonToken
      .connect(owner)
      .approve(swap.address, ethers.parseUnits('1000', 18));
  });

  it('Should add liquidity correctly', async function () {
    const amount0 = ethers.parseUnits('100', 18);
    const amount1 = ethers.parseUnits('200', 18);

    await swap.connect(owner).addLiquidity(amount0, amount1, true);

    const swapBalance0 = await apolloToken.balanceOf(swap.address);
    const swapBalance1 = await moonToken.balanceOf(swap.address);

    expect(swapBalance0).to.equal(amount0);
    expect(swapBalance1).to.equal(amount1);

    const lpBalance = await swap.balanceOf(owner.address);
    expect(lpBalance).to.be.gt(0);
  });
});
