// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20Metadata} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

contract Swap is ERC20 {
    IERC20 public token0;
    IERC20 public token1;
    uint256 public k;

    uint256 public reserve0;
    uint256 public reserve1;

    constructor(address _token0, address _token1) ERC20("Swap", "SWAP") {
        token0 = IERC20(_token0);
        token1 = IERC20(_token1);
    }

    function addLiquidity(uint256 _maxAmount0, uint256 _maxAmount1, bool _base0) external {
        if (reserve0 == 0) {
          reserve0 = _maxAmount0;
          reserve1 = _maxAmount1;
          token0.transferFrom(msg.sender, address(this), _maxAmount0);
          token1.transferFrom(msg.sender, address(this), _maxAmount1);

          if (_maxAmount0 > _maxAmount1) {
            _mint(msg.sender, _maxAmount0 * 10 ** (18 - IERC20Metadata(address(token0)).decimals()));
          } else {
            _mint(msg.sender, _maxAmount1 * 10 ** (18 - IERC20Metadata(address(token1)).decimals()));
          }
        } else {
          uint256 validAmount0;
          uint256 validAmount1;
          if (_base0) {
            validAmount0 = _maxAmount0;
            validAmount1 = (_maxAmount0 * reserve1) / reserve0;
          } else {
            validAmount1 = _maxAmount1;
            validAmount0 = (_maxAmount1 * reserve0) / reserve1;
          }
          if (validAmount0 > _maxAmount0 || validAmount1 > _maxAmount1) {
            revert("Invalid amount");
          }

          uint256 supplyLp = totalSupply();
          uint256 amountLp = validAmount1 * supplyLp / reserve1;
          _mint(msg.sender, amountLp);

          reserve0 += validAmount0;
          reserve1 += validAmount1;
          token0.transferFrom(msg.sender, address(this), validAmount0);
          token1.transferFrom(msg.sender, address(this), validAmount1);
        }
        k = reserve0 * reserve1;
    }

    // removeLP
    function removeLiquidity(uint256 _lpAmount) external {
      require(_lpAmount > 0, "LP amount must be greater than 0");

      uint256 totalSupplyLp = totalSupply();
      require(_lpAmount > 0, "LP amount must be greater than 0");

      uint256 amount0 = (reserve0 * _lpAmount) / totalSupplyLp;
      uint256 amount1 = (reserve1 * _lpAmount) / totalSupplyLp;

      _burn(msg.sender, _lpAmount);

      reserve0 -= amount0;
      reserve1 -= amount1;
      k = reserve0 * reserve1;

      token0.transfer(msg.sender, amount0);
      token1.transfer(msg.sender, amount1);
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
