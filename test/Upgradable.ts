import { ethers, upgrades } from 'hardhat';
import { expect } from 'chai';

describe('Proxy Upgrade with Upgrades Plugin', function () {
  let proxy: any;
  let ImplementationV1: any;
  let ImplementationV2: any;

  before(async function () {
    ImplementationV1 = await ethers.getContractFactory('ImplementationV1');
    ImplementationV2 = await ethers.getContractFactory('ImplementationV2');
  });

  it('Should deploy and return Version 1', async function () {
    proxy = await upgrades.deployProxy(ImplementationV1, [], {
      initializer: 'initialize',
    });

    const version = await proxy.version();
    expect(version).to.equal('Version 1');
  });

  it('Should upgrade to Version 2', async function () {
    const proxyAddress = await proxy.address;

    proxy = await upgrades.upgradeProxy(proxyAddress, ImplementationV2);

    const version = await proxy.version();
    expect(version).to.equal('Version 2');
  });
});
