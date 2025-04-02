//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DMessage{
    struct Message{
        address sender;
        string message;
        uint256 timestamp;
    }

    Message[] public messages;
    event MessageSent(address indexed sender ,string content , uint256 timestamp);

    function previewMessage(string memory newMessage) public pure returns (string memory){
        return newMessage;
    }

    function sendMessage(string memory newMessage) public {
        messages.push( Message(msg.sender,newMessage,block.timestamp));
        emit MessageSent(msg.sender ,  previewMessage(newMessage), block.timestamp);
    }
    function getMessage() public view returns (Message[] memory){
        return messages;
    }
}
