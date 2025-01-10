// import { expect } from 'chai';
// import { ContractFactory } from 'ethers';
// import { ethers, upgrades } from 'hardhat';

// describe('Demo Proxy', function () {
//   let proxy: any;
//   let implementationV1: any;
//   let implementationV2: any;

//   describe('Proxy interaction', function () {
//     it('Should be interactable via proxy with ImplementationV1', async function () {
//       const [owner, otherAccount] = await ethers.getSigners();

//       // Deploy ImplementationV1 with proxy
//       const ImplementationV1 = await ethers.getContractFactory(
//         'ImplementationV1'
//       );
//       proxy = await upgrades.deployProxy(
//         ImplementationV1 as unknown as ContractFactory,
//         [],
//         {
//           initializer: 'initialize',
//         }
//       );
//       await proxy.deployed();

//       // Check version
//       expect(await proxy.connect(otherAccount ).version()).to.equal('Version 1');
//     });
//   });

//   describe('Upgrading', function () {
//     it('Should have upgraded the proxy to DemoV2', async function () {
//       const [owner, otherAccount] = await ethers.getSigners();

//       // Deploy and upgrade to ImplementationV2
//       const ImplementationV2 = await ethers.getContractFactory(
//         'ImplementationV2'
//       );
//       const upgradedProxy = await upgrades.upgradeProxy(
//         proxy.address,
//         ImplementationV2 as unknown as ContractFactory
//       );

//       // Check if the version is upgraded
//       expect(await upgradedProxy.connect(otherAccount).version()).to.equal(
//         'Version 2'
//       );
//     });

//     it('Should have set the name during upgrade', async function () {
//       const [owner, otherAccount] = await ethers.getSigners();

//       // Get the proxy instance with V2 interface
//       const demoV2 = await ethers.getContractAt(
//         'ImplementationV2',
//         proxy.address
//       );
//       expect(await demoV2.connect(otherAccount).name()).to.equal(
//         'Example Name'
//       );
//     });
//   });
// });
