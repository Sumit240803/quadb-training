// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleStorage {
    uint256 public storedNumber;

    function setNumber(uint256 _num) public {
        storedNumber = _num;
    }

    function getNumber() public view returns (uint256) {
        return storedNumber;
    }
}
