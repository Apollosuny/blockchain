// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

contract Swap {
    IERC20 public token0;
    IERC20 public token1;
    uint256 public k;

    uint256 public reserve0;
    uint256 public reserve1;

    constructor(address _token0, address _token1) {
        token0 = IERC20(_token0);
        token1 = IERC20(_token1);
    }

    function addLiquidity(uint256 _amount0, uint256 _amount1) external {
        // xử lý khi supply0, supply 1 > 0
        uint256 supply0 = reserve0;
        uint256 supply1 = reserve1;

        if (supply0 > 0 && supply1 > 0) {
          require(_amount0 * supply1 == _amount1 * supply0, "Invalid amount");
        }

        // biến smart contract thành một token (LP Token)
        reserve0 += _amount0;
        reserve1 += _amount1;
        k = reserve0 * reserve1;
        token0.transferFrom(msg.sender, address(this), _amount0);
        token1.transferFrom(msg.sender, address(this), _amount1);
    }

    function swap(address _from, uint256 _amountIn) external {
        // tính phí 0.3%
        // uint256 fee = (_amountIn * 3) / 1000;
        // uint256 amountIn = _amountIn - fee;
        uint256 supply0 = reserve0;
        uint256 supply1 = reserve1;

        if (address(token0) == _from) {
            // supply0 * supply1 = (supply0 + amountIn) * (supply1 - amountOut)
            // supply0 * supply1 = supply0 * supply1 - supply0 * amountOut + supply1 * amountIn - amountIn * amountOut
            // 0 = -supply0 * amountOut + supply1 * amountIn - amountIn * amountOut
            // supply0 * amountOut - amountIn * amountOut = supply1 * amountIn
            // amountOut * (supply0 - amountIn) = supply1 * amountIn
            // amountOut = (supply1 * amountIn) / (supply0 - amountIn)
            uint256 amountOut = (_amountIn * supply1) / (supply0 - _amountIn);
            token0.transferFrom(msg.sender, address(this), _amountIn);
            token1.transfer(msg.sender, amountOut);
            reserve0 += _amountIn;
            reserve1 -= amountOut;
        } else {
            uint256 amountOut = (_amountIn * reserve0) / (reserve1 - _amountIn);
            token1.transferFrom(msg.sender, address(this), _amountIn);
            token0.transfer(msg.sender, amountOut);
            reserve0 -= amountOut;
            reserve1 += _amountIn;
        }
    }
}