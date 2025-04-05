"use client";
import useContract from '@/app/hooks/useContract';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const Ticket = () => {
  const { id } = useParams();
  const { contract, account } = useContract();
  const [meta, setMeta] = useState(null);

  const getMeta = async () => {
    if (!contract || !id) return;

    try {
      const uri = await contract.tokenURI(id);
      const metadataResponse = await fetch(uri.replace("ipfs://", "https://ipfs.io/ipfs/"));
      const metadata = await metadataResponse.json();
     /* const ticket = await contract.getTicket(id);
      const price = ticket.price.toString();*/
     /* console.log("Ticket : ",ticket);
      console.log("Price : ", price);*/
      setMeta(metadata);
      console.log(metadata);
    } catch (error) {
      console.error("Error fetching metadata:", error);
    }
  };

  const buy = async()=>{
    if (!contract || !id) return;
    try {
      const ticket = await contract.getTicket(id);
      const price = ticket.price.toString();
      const tx = await contract.buyTicket(id,{value : price});
      await tx.wait();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getMeta();
  }, [contract, account, id]);

  return (
    <div className="p-6">
      {meta ? (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
          <div className="md:flex">
            <div className="md:shrink-0">
              <img className="h-48 w-full object-cover md:h-full md:w-48" src={meta.image} alt={meta.name} />
            </div>
            <div className="p-8">
              <h1 className="uppercase tracking-wide text-lg text-indigo-500 font-semibold">{meta.name}</h1>
              <p className="mt-2 text-gray-500">{meta.description}</p>
              {meta.attributes && meta.attributes.length > 0 && (
                <div className="mt-4">
                  {meta.attributes.map((attr, index) => (
                    <p key={index}><strong>{attr.trait_type}:</strong> {attr.value}</p>
                  ))}
                </div>
              )}
              <button className='cursor-pointer' onClick={()=>buy()}>Buy</button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">Loading ticket details...</p>
      )}
    </div>
  );
};

export default Ticket;