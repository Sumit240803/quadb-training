"use client";
import React, { useEffect, useState } from 'react';
import useContract from '../hooks/useContract';
import { ethers } from 'ethers';
import Link from 'next/link';
import Image from 'next/image';

const AllTickets = () => {
  const { contract, account } = useContract();
  const [allTickets, setAllTickets] = useState([]);

  useEffect(() => {
    const loadTickets = async () => {
      if (!contract || !account) return;

      try {
        const tickets = await contract.getAllTickets();

        const withMetadata = await Promise.all(
          tickets.map(async (ticket) => {
            const tokenId = ticket.tokenId.toString();
            const uri = await contract.tokenURI(tokenId);
            const response = await fetch(uri.replace("ipfs://", "https://ipfs.io/ipfs/"));
            const metadata = await response.json();

            return {
              tokenId,
              seller: ticket.seller,
              price: ethers.formatEther(ticket.price),
              isListed: ticket.isListed,
              metadata,
            };
          })
        );

        //console.log("Tickets with metadata:", withMetadata);
        setAllTickets(withMetadata);
      } catch (error) {
        console.error("Error loading tickets:", error);
      }
    };

    loadTickets();
  }, [contract, account]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Tickets</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allTickets.length === 0 ? (
          <p>No tickets found</p>
        ) : (
          allTickets.map((ticket, index) => (
            <div key={index} className=" p-4 w-fit rounded shadow bg-white">
              <Image
                src={ticket.metadata.image}
                alt={ticket.metadata.name}
                width={200} // or any large width you want
  height={200} // adjust based on aspect ratio
                className=" object-cover rounded mb-4"
              />
              <h3 className="text-xl font-semibold">{ticket.metadata.name}</h3>
              <p className="text-gray-600">{ticket.metadata.description}</p>
              {ticket.metadata.attributes?.map((attr, idx) => (
                <p key={idx}><strong>{attr.trait_type}:</strong> {attr.value}</p>
              ))}
            
            
              <p><strong>Price:</strong> {ticket.price} ETH</p>
              <p><strong>Status:</strong> {ticket.isListed ? 'Listed' : 'Sold'}</p>
              <Link
                href={`/pages/tickets/${ticket.tokenId}`}
                className="inline-block mt-3 text-blue-500 hover:underline"
              >
                View Ticket Page To Buy →
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AllTickets;
