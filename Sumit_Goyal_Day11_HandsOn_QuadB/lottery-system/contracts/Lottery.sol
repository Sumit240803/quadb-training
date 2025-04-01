// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBase.sol";

contract Lottery is VRFConsumerBase {
    address public manager;
    address[] public players;
    uint256 public lotteryEndTime;
    uint256 public entryFee;

    bytes32 internal keyHash;
    uint256 internal fee;
    uint256 public randomResult;

    event LotteryEntered(address indexed player);
    event WinnerPicked(address indexed winner  , uint256 amount);

    constructor(
        address _vrfCoordinator,
        address _linkToken,
        bytes32 _keyHash,
        uint256 _fee,
        uint256 _entryFee
    ) VRFConsumerBase(_vrfCoordinator , _linkToken){
        manager = msg.sender;
        keyHash = _keyHash;
        fee = _fee;
        entryFee = _entryFee;
        lotteryEndTime = block.timestamp + 1 weeks;
    }

    function enter() public payable{
        require(msg.value >= entryFee,"Not enough ether to participate");
        require(block.timestamp < lotteryEndTime,"Lottery Has Ended");

        players.push(msg.sender);
        emit LotteryEntered(msg.sender);
    }
    function pickWinner() public onlyManager{
        require(players.length > 0,"No Players in the Lottery");
        requestRandomness(keyHash,fee);
    }
    function fulfillRandomness(bytes32, uint256 randomness) internal override {
        randomResult = randomness;
        uint256 index = randomResult%players.length;
        address winner = players[index];

        uint256 prize = address(this).balance;
        payable(winner).transfer(prize);

        emit WinnerPicked(winner,prize);

        delete players;
        lotteryEndTime = block.timestamp + 1 weeks;
    }
    modifier onlyManager(){
        require(msg.sender==manager,"Only the manager can call this");
        _;
    }

    function contractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getPlayers() public view returns (address[] memory){
        return players;
    }
}