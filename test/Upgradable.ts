import { ethers, upgrades } from 'hardhat';
import { expect } from 'chai';

describe('Proxy Upgrade with Upgrades Plugin', function () {
  let proxy: any;

  it('Should deploy and return Version 1', async function () {
    const ImplementationV1 = await ethers.getContractFactory(
      'ImplementationV1'
    );
    proxy = await upgrades.deployProxy(ImplementationV1, [], {
      initializer: 'initialize',
    });
    await proxy.waitForDeployment();

    const address = await proxy.getAddress();

    console.log('Proxy address:', address);

    const version = await proxy.version();
    expect(version).to.equal('Version 1');
  });

  it('Should upgrade to Version 2', async function () {
    const ImplementationV2 = await ethers.getContractFactory(
      'ImplementationV2'
    );
    const address = await proxy.getAddress();
    proxy = await upgrades.upgradeProxy(address, ImplementationV2);

    const version = await proxy.version();
    expect(version).to.equal('Version 2');
  });
});
