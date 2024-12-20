import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const EscrowModule = buildModule('EscrowModule', (m) => {
  const receiver = m.getParameter(
    'receiver',
    '0x742D81cAAC955cbE111EBCD0358D78784Ab4B0c9'
  );

  const escrow = m.contract('Escrow', [receiver]);

  return { escrow };
});

export default EscrowModule;
