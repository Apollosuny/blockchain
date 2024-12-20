// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Lock {
    address public owner;
    address public claimer;
    uint public totalAmount;
    uint public startTime;
    uint public installments;
    uint public installmentAmount;
    uint public withDrawnInstallments;

    error OnlyClaimerCanWithdraw(address _operator);

    constructor(address _claimer, uint _installments) payable {
        owner = msg.sender;
        claimer = _claimer;
        totalAmount = msg.value;
        startTime = block.timestamp;
        installments = _installments;
        installmentAmount = totalAmount / installments;
        withDrawnInstallments = 0;
    }

    function withdraw() public {
        if (msg.sender != claimer) revert OnlyClaimerCanWithdraw(msg.sender);
        
        
    }
}
