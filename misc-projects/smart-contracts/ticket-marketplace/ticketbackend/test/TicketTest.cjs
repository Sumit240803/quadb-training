const { expect } = require("chai");
const hre = require("hardhat");

describe("TicketMarketPlace", function(){
    let TicketMarketPlace,ticketMarktplace, owner, user1 , user2;
    const listingFee = hre.ethers.parseEther("0.0001");
    const ticketPrice = hre.ethers.parseEther("0.05");

    this.beforeEach(async()=>{
        [owner,user1,user2] = await hre.ethers.getSigners();
        TicketMarketPlace = await hre.ethers.getContractFactory("TicketMarketPlace");
        ticketMarktplace = await TicketMarketPlace.deploy();
        await ticketMarktplace.waitForDeployment();
    })

    it("Should deploy with correct owner and listing fee", async ()=>{
        expect(await ticketMarktplace.listingFee()).to.equal(listingFee);
        expect(await ticketMarktplace.owner()).to.equal(owner.address);
    });
     it("Should Allow User To Mint a Ticket ", async ()=>{
        await ticketMarktplace.connect(user1).mintTicket(
            "ipfs://test-metadata-uri",
            ticketPrice,
            { value: listingFee }
        )

        const ticket = await ticketMarktplace.tickets(1);
        expect(ticket.tokenId).to.equal(1);
        expect(ticket.seller).to.equal(user1.address);
        expect(ticket.price).to.equal(ticketPrice);
        expect(ticket.isListed).to.be.true;

        expect(await ticketMarktplace.ownerOf(1)).to.equal(user1.address);
     });

     it("Should Allow another user to buy a ticket ",async ()=>{
        await ticketMarktplace.connect(user1).mintTicket(
            "ipfs://test-metadata-uri",
            ticketPrice,
            { value: listingFee }
        )
        await ticketMarktplace.connect(user2).buyTicket(1,{
            value : ticketPrice
        });
        expect(await ticketMarktplace.ownerOf(1)).to.equal(user2.address);
        const ticket = await ticketMarktplace.tickets(1);
        expect(ticket.isListed).to.be.false;
     })
     it("Should revert if user pays incorrect listing fee", async () => {
        await expect(
          ticketMarktplace.connect(user1).mintTicket(
            "ipfs://wrong-fee",
            ticketPrice,
            { value: hre.ethers.parseEther("0.005") }
          )
        ).to.be.revertedWith("Pay Listing Fee");
      });

      it("Should allow resale of ticket", async () => {
        await ticketMarktplace.connect(user1).mintTicket(
          "ipfs://resale-uri",
          ticketPrice,
          { value: listingFee }
        );
    
        await ticketMarktplace.connect(user1).listForResale(1, ticketPrice, {
          value: listingFee
        });
    
        const ticket = await ticketMarktplace.tickets(1);
        expect(ticket.seller).to.equal(user1.address);
        expect(ticket.isListed).to.be.true;
      });

      it("Should return all minted tickets using getAllTickets", async () => {
        await ticketMarktplace.connect(user1).mintTicket(
          "ipfs://ticket-1",
          ticketPrice,
          { value: listingFee }
        );
      
        await ticketMarktplace.connect(user2).mintTicket(
          "ipfs://ticket-2",
          ticketPrice,
          { value: listingFee }
        );
      
        const allTickets = await ticketMarktplace.getAllTickets();
        expect(allTickets.length).to.equal(2);
      
        // Check metadata from ticket 1
        const ticket1 = allTickets[0];
        expect(ticket1.tokenId).to.equal(1n);
        expect(ticket1.seller).to.equal(user1.address);
        expect(ticket1.price).to.equal(ticketPrice);
        expect(ticket1.isListed).to.be.true;
        const tokenUri1 = await ticketMarktplace.tokenURI(ticket1.tokenId);
        expect(tokenUri1).to.equal("ipfs://ticket-1");
      
        // Check metadata from ticket 2
        const ticket2 = allTickets[1];
        expect(ticket2.tokenId).to.equal(2n);
        expect(ticket2.seller).to.equal(user2.address);
        expect(ticket2.price).to.equal(ticketPrice);
        expect(ticket2.isListed).to.be.true;
        const tokenUri2 = await ticketMarktplace.tokenURI(ticket2.tokenId);
        expect(tokenUri2).to.equal("ipfs://ticket-2");
      });
      
      
})
