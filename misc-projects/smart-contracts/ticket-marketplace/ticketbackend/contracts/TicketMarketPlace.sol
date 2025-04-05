// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
contract TicketMarketPlace is ERC721URIStorage, ReentrancyGuard, Ownable{
    uint public ticketCount;
    uint public listingFee = 0.0001 ether;
    struct Ticket {
        uint tokenId;
        address payable seller;
        uint price;
        bool isListed;
    }

    mapping(uint => Ticket) public tickets;
    constructor() ERC721("EventTickets" , "ETKT") Ownable(msg.sender) {}

    function mintTicket(string memory _tokenURI, uint _price) external payable{
        require(msg.value == listingFee, "Pay Listing Fee");
        ticketCount++;
        uint newTokenId = ticketCount;
        _safeMint(msg.sender,newTokenId);
        _setTokenURI(newTokenId,_tokenURI);
        tickets[newTokenId] = Ticket(newTokenId,payable(msg.sender), _price,true);
    }

    function buyTicket(uint _tokenId) external payable nonReentrant{
        Ticket storage ticket = tickets[_tokenId];
        require(ticket.isListed,"Not For Sale");
        require(msg.value==ticket.price,"Wrong Price");
        address seller = ticket.seller;
        ticket.isListed = false;
        ticket.seller = payable(address(0));
        _transfer(seller,msg.sender,_tokenId);
        payable(seller).transfer(msg.value);
    }
    function getTicket(uint _tokenId) public view returns (Ticket memory) {
    return tickets[_tokenId];
}


    function getAllTickets() external view returns (Ticket[] memory){
        Ticket[] memory result = new Ticket[](ticketCount);
        for(uint i = 1 ; i<=ticketCount ; i++){
            result[i-1] = tickets[i];
        }
        return result;
    }

    function listForResale(uint _tokenId, uint _price) external payable{
        require(ownerOf(_tokenId) == msg.sender,"Not the owner");
        require(msg.value == listingFee,"Pay Listing Fee");
        tickets[_tokenId] = Ticket(_tokenId, payable(msg.sender),_price,true);
    }
    function updateListingFee(uint _fee) external onlyOwner{
        listingFee = _fee;
    }

    function withdraw() external onlyOwner{
        payable(owner()).transfer(address(this).balance);
    }

}