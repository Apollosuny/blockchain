import { expect } from 'chai';
import hre from 'hardhat';

describe('Escrow', function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  // async function deployOneYearLockFixture() {
  //   // Contracts are deployed using the first signer/account by default
  //   const [owner, claimer] = await hre.ethers.getSigners();

  //   const Escrow = await hre.ethers.getContractFactory("Escrow");
  //   const escrow = await Escrow.deploy(claimer.address);

  //   return { escrow, owner, claimer };
  // }

  it('Test flow', async function () {
    const [owner, claimer] = await hre.ethers.getSigners();

    const Escrow = await hre.ethers.getContractFactory('Escrow');
    const escrow = await Escrow.deploy(claimer.address);

    await escrow.deposit({ value: 100 });
    expect(await escrow.amount()).to.equal(100);

    await expect(escrow.withdraw())
      .revertedWithCustomError(escrow, 'OnlyClaimerCanWithdraw')
      .withArgs(owner.address);

    await expect(escrow.connect(claimer).withdraw()).changeEtherBalances(
      [claimer, escrow],
      [100, -100]
    );
  });
});
