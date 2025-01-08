import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('ApolloToken', function () {
  it('Should deploy with the correct initial supply', async function () {
    const [owner] = await ethers.getSigners();
    const initialSupply = ethers.utils.parseUnits('1000', 18);

    // Deploy ApolloToken
    const ApolloTokenFactory = await ethers.getContractFactory('ApolloToken');
    const apolloToken = await ApolloTokenFactory.deploy(initialSupply);

    const balance = await apolloToken.balanceOf(owner.address);

    expect(balance).to.equal(initialSupply);
  });
});
