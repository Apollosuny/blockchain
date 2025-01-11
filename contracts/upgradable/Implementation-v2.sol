// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract ImplementationV2 is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    string private _version;
    
    function initialize() public initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
        _version = "Version 2";
    }
    
    function version() public view returns (string memory) {
        return _version;
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}