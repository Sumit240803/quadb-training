//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Vulnerable{
    mapping(address => uint256) public balances;

    function deposit() public payable{
        balances[msg.sender] += msg.value;
    }
    function withdraw() public {
    uint balance = balances[msg.sender];
    require(balance > 0);

    (bool success, ) = msg.sender.call{value: balance}("");
    require(success, "Failed to send Ether");

    balances[msg.sender] = 0; // vulnerable line — should come **after** the call
}


    function getBalance() public view returns(uint256) {
        return address(this).balance;
    }
}