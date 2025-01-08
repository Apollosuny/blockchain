import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('MoonToken', function () {
  it('Should deploy with the correct initial supply', async function () {
    const [owner] = await ethers.getSigners();
    const initialSupply = ethers.utils.parseUnits('1000', 18);

    // Deploy MoonToken
    const MoonTokenFactory = await ethers.getContractFactory('MoonToken');
    const moonToken = await MoonTokenFactory.deploy(initialSupply);

    const balance = await moonToken.balanceOf(owner.address);

    expect(balance).to.equal(initialSupply);
  });
});
