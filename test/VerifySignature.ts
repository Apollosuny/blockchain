import { ethers } from 'ethers';
import { expect } from 'chai';
import { ethers as hreEthers } from 'hardhat';

describe('VerifySignature Contract', () => {
  let contract: any;

  const serverPrivateKey =
    '0xe12f5e0f929597729d4cac169566a97417b1ef618b3497b5347c3d8badee15d1';
  const serverPublicAddress = '0x5EA209CC1E59Fbe34962Df83fA8560B460ff743E';

  const serverWallet = new ethers.Wallet(serverPrivateKey);

  before(async () => {
    // Deploy contract
    const VerifySignature = await hreEthers.getContractFactory(
      'VerifySignature'
    );
    contract = await VerifySignature.deploy(serverPublicAddress);
    await contract.deployed();
  });

  it('should verify the signature created by the server', async () => {
    const message =
      'User: 0x1234567890abcdef1234567890abcdef12345678, Amount: 100';
    const messageHash = ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes(message)
    );
    const signature = await serverWallet.signMessage(
      ethers.utils.arrayify(messageHash)
    );

    const isValid = await contract.verify(
      messageHash,
      signature,
      serverPublicAddress
    );

    expect(isValid).to.be.true;
  });

  it('should fail for invalid signatures or different signers', async () => {
    const message =
      'User: 0x1234567890abcdef1234567890abcdef12345678, Amount: 200';
    const messageHash = ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes(message)
    );
    const signature = await serverWallet.signMessage(
      ethers.utils.arrayify(messageHash)
    );

    const invalidMessageHash = ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes('Invalid message')
    );

    const isValid = await contract.verify(
      invalidMessageHash,
      signature,
      serverPublicAddress
    );

    expect(isValid).to.be.false;

    const invalidPublicAddress = '0x1234567890abcdef1234567890abcdef12345678';
    const isValidWithInvalidAddress = await contract.verify(
      messageHash,
      signature,
      invalidPublicAddress
    );

    expect(isValidWithInvalidAddress).to.be.false;
  });
});
