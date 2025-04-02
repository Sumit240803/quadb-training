"use client"
import React, { useState } from 'react'
import { connectWallet, getSigner } from '../utils/ethers';
import { ethers } from 'ethers';

const GasFeeComparison = () => {
    const [gasFees, setGasFees] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [amount , setAmount] = useState("");
    const[receiver , setReceiver] = useState("");
    

    const sendTransaction=async()=>{
        try {
            setIsLoading(true);
            const signer = await connectWallet();
            const tx = {
                to : receiver,
                value : ethers.parseEther(amount)
            }
            const transaction = await signer.sendTransaction(tx);
            const receipt = await transaction.wait();
            console.log("Transaction Completed");
            console.log("Gas Used : " ,receipt.gasUsed.toString());
            console.log("Gas Price : ", receipt.gasPrice.toString());
            setGasFees(prev=>[
                ...prev ,{gasUsed : receipt.gasUsed.toString() ,gasPrice : receipt.gasPrice.toString(), txHash : receipt.hash}
            ]);
            setIsLoading(false);

        } catch (error) {
            console.error("Error in transaction:", error);
            setIsLoading(false);
        }
    }
  return (
    <div className='p-4 text-center space-y-10'>
        <div className='text-xl font-bold text-center'>Gass Fee Comparison</div>
        <input className='p-4 border border-black rounded-2xl m-2' placeholder='Enter Amount' value={amount} onChange={(e)=>setAmount(e.target.value)}/>
        <input className='p-4 border border-black rounded-2xl m-2' placeholder="Enter Receiver's Address" value={receiver} onChange={(e)=>setReceiver(e.target.value)}/>
        <button className='cursor-pointer border border-black text-white p-3 bg-green-700 rounded-3xl ' onClick={sendTransaction} disabled= {isLoading}>{ isLoading ? 'Sending Transaction' : "Send Transaction"}</button>
        <ul>
            {gasFees.length > 0 ? (
                gasFees.map((fee , index)=>(
                    <li key={index}>
                        Transaction {index+1} done <br/>
                        Gas Fees : {fee.gasUsed} wei <br/>
                        Gas Price : {fee.gasPrice} wei <br/>
                        Transaction Hash : {fee.txHash}
                    </li>
                ))
            ) : "No transactions Right Now"}
        </ul>

    </div>
  )
}

export default GasFeeComparison