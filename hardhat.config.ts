import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import '@typechain/hardhat';
import '@nomiclabs/hardhat-ethers';
import '@openzeppelin/hardhat-upgrades';

const config: HardhatUserConfig = {
  solidity: '0.8.28',
  typechain: {
    outDir: 'typechain-types',
    target: 'ethers-v5',
  },
};

export default config;
