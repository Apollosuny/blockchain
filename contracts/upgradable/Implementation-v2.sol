// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract ImplementationV2 {
    string public name; 
    function initialize() public {
        // This function is kept empty to demonstrate that the initialize function is not mandatory
    }

    function version() public pure returns (string memory) {
        return "Version 2";
    }

    function setName(string memory _name) public {
      name = _name;
    }
}