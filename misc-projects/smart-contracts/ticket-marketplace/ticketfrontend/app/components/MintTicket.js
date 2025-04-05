"use client"
import React, { useState } from 'react'
import useContract from '../hooks/useContract'
import axios from 'axios';
import { ethers } from 'ethers';

const MintTicket = () => {
    const {contract , account} = useContract();
    const [eventName, setEventName] = useState("");
    const [ticketPrice, setTicketPrice] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    
    const uploadToIPFS = async () => {
        if (!image) return alert("Please select an image!");
      
        setUploading(true);
        try {
          // Upload image to IPFS
          const formData = new FormData();
          formData.append("file", image);
      
          const resImg = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
            },
          });
          
      
          const imgCid = resImg.data.IpfsHash;
          const imageUrl = `https://gateway.pinata.cloud/ipfs/${imgCid}`;
      
          // ✅ Create metadata
          const metadata = {
            name: eventName,
            description: `Ticket for ${eventName} on ${eventDate}`,
            image: imageUrl,
            attributes: [{ trait_type: "Date", value: eventDate }],
          };
      
          // ✅ Convert metadata to Blob and FormData
          const metadataBlob = new Blob([JSON.stringify(metadata)], { type: "application/json" });
          const metadataFormData = new FormData();
          metadataFormData.append("file", metadataBlob, "metadata.json");
      
          // ✅ Upload metadata to IPFS
          const resMeta = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", metadata, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
            },
            params: {
                pinataMetadata: JSON.stringify({
                  name: `${eventName.replace(/\s/g, "_")}_metadata`,
                }),
              },
          });
          
      
          
          const tokenURI = `https://gateway.pinata.cloud/ipfs/${resMeta.data.IpfsHash}`;
      
          setUploading(false);
          return tokenURI;
        } catch (error) {
          console.error("IPFS Upload Error:", error);
          setUploading(false);
          return null;
        }
      };
      
      const mintTicket = async () => {
        if (!contract) return alert("Connect Wallet First!");
    
        const tokenURI = await uploadToIPFS();
        if (!tokenURI) return alert("Failed to generate Token URI!");
    
        try {
          const tx = await contract.mintTicket(tokenURI, ethers.parseEther(ticketPrice), {
            value: ethers.parseEther("0.0001"),
          });
          await tx.wait();
          const tickets = await contract.getAllTickets();
          //console.log(tickets);
         // console.log(await tx.wait());
          alert("Ticket Minted!");
        } catch (error) {
          console.error("Transaction Error:", error);
          alert("Transaction Failed!");
        }
      };
  return (
  
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
    <h2 className="text-2xl font-bold text-center text-green-700 mb-6">🎟️ Create Ticket</h2>
  
    <input
      type="text"
      placeholder="Event Name"
      onChange={(e) => setEventName(e.target.value)}
      className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
    />
  
    <input
      type="text"
      placeholder="Ticket Price (ETH)"
      onChange={(e) => setTicketPrice(e.target.value)}
      className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
    />
  
    <input
      type="date"
      onChange={(e) => setEventDate(e.target.value)}
      className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
    />
  
    <input
      type="file"
      onChange={(e) => setImage(e.target.files[0])}
      className="w-full mb-6 p-3 border rounded-lg cursor-pointer bg-gray-50"
    />
  
    <button
      onClick={mintTicket}
      disabled={uploading}
      className={`w-full py-3 rounded-lg text-white font-semibold ${
        uploading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
      }`}
    >
      {uploading ? "Uploading..." : "Mint Ticket"}
    </button>
  </div>
  
  
  )
}

export default MintTicket