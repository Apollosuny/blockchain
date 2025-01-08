// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract VerifySignature {
  address public signer;

  constructor(address _publicKey) {
    signer = _publicKey;
  }

  function verify(bytes32 messageHash, bytes memory signature, address expectedSigner) 
        public 
        pure 
        returns (bool) 
    {
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);
        address recoveredSigner = recoverSigner(ethSignedMessageHash, signature);
        return recoveredSigner == expectedSigner;
    }

    function getEthSignedMessageHash(bytes32 messageHash)
        internal
        pure
        returns (bytes32)
    {
        return keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash)
        );
    }

    function recoverSigner(bytes32 ethSignedMessageHash, bytes memory signature)
        internal
        pure
        returns (address)
    {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(signature);
        return ecrecover(ethSignedMessageHash, v, r, s);
    }

    function splitSignature(bytes memory sig)
        internal
        pure
        returns (
            bytes32 r,
            bytes32 s,
            uint8 v
        )
    {
        require(sig.length == 65, "invalid signature length");
        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
        // Điều chỉnh v nếu cần
        if (v < 27) {
            v += 27;
        }
    }
}