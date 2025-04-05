"use client"
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { ContractABI, ContractAddress } from '../lib/constants';

const useContract = () => {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const loadContract = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(ContractAddress,ContractABI,signer);
        setContract(contract);
        /*const readOnly = new ethers.Contract(ContractAddress, ContractABI, provider);
        const writable = new ethers.Contract(ContractAddress, ContractABI, signer);

        setReadContract(readOnly);    // ✅ for view functions like getAllTickets
        setContract(writable);        // ✅ for state-changing functions*/

        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccount(accounts[0]);
      }
    };
    loadContract();
  }, []);

  return { contract, account };
};

export default useContract;
