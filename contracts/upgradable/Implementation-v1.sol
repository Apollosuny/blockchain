// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract ImplementationV1 {

    function initialize() public {
        // This function is kept empty to demonstrate that the initialize function is not mandatory
    }

    function version() public pure returns (string memory) {
        return "Version 1";
    }
}