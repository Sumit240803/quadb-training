"use client";
import React, { useEffect, useState } from 'react'
import useContract from '../hooks/useContract';

const MyTickets = () => {
    const { contract, account } = useContract();
    const [myTickets, setMyTickets] = useState([]);
    useEffect(()=>{
        const loadTickets = async()=>{
            if(!contract || !account) return;
            try {
                const allTickets = await contract.getAllTickets();
               // console.log("All Tickets : ",allTickets);
                const ownedTickets= await Promise.all(
                    allTickets.map(async(ticket)=>{
                        const owner = await contract.ownerOf(ticket.tokenId);
                        if(owner.toLowerCase() === account.toLowerCase()){
                            return ticket;
                        }else{
                            return null;
                        }
                    })
                )
               // console.log("Owned Tickets : ", ownedTickets.filter((t)=>t!==null));
                setMyTickets(ownedTickets.filter((t)=>t!==null));
            } catch (error) {
                console.error("Error loading tickets:", error);
            }
        }
        loadTickets();
        
            
    },[contract,account])
  
    return (
        <div className="max-w-3xl mx-auto mt-10 bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">🎟️ My Tickets</h2>
      
        {myTickets.length === 0 ? (
          <p className="text-gray-600 text-center">No tickets found.</p>
        ) : (
          <ul className="space-y-4">
            {myTickets.map((ticket) => (
              <li
                key={ticket.tokenId}
                className="border p-4 rounded-lg flex justify-between items-center shadow-sm hover:shadow-md transition"
              >
                <div>
                  <p className="text-lg font-semibold">
                    🎫 Ticket #{ticket.tokenId}
                  </p>
                  <p className="text-sm text-gray-600">
                    Price: <span className="font-medium">{Number(ticket.price) / 1e18} ETH</span>
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    ticket.isListed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                  }`}
                >
                  {ticket.isListed ? "Listed" : "Not Listed"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      
  )
}

export default MyTickets