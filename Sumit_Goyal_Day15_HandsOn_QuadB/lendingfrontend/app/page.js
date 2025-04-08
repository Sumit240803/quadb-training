"use client";
import { useState } from "react";
import { callTransaction } from "./utils/aptosFunctions";

export default function Home() {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    try {
      const response = await window.aptos.connect();
      setAccount(response.address);
    } catch (err) {
      console.error("Wallet connection failed", err);
    }
  };

  const initUser = async () => {
    try {
      const tx = await callTransaction("init_user");
      alert("User initialized! TX: " + tx.hash);
    } catch {
      
    }
  };

  const initPool = async () => {
    try {
      const tx = await callTransaction("init_pool");
      alert("Pool initialized! TX: " + tx.hash);
    } catch {
      
    }
  };

  const takeLoan = async () => {
    try {
      const amount = "1000000"; // 1 APT = 1,000,000 Octas
      const interest = "5";
      const tx = await callTransaction("take_loan", [amount, interest]);
      alert("Loan success! TX: " + tx.hash);
    } catch {
      
    }
  };

  const repayLoan = async () => {
    try {
      const loanIndex = "0"; // Repay first loan
      const tx = await callTransaction("repay_loan", [loanIndex]);
      alert("Repayment success! TX: " + tx.hash);
    } catch {
      
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
  <h1 className="text-3xl font-bold mb-4 text-gray-800">Aptos Lending DApp</h1>

  {account ? (
    <p className="text-green-600 font-medium mb-4">Connected as: {account}</p>
  ) : (
    <button
      onClick={connectWallet}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
    >
      Connect Wallet
    </button>
  )}

  <div className="mt-6 space-x-4">
    <button
      onClick={initUser}
      className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
    >
      Init User
    </button>

    <button
      onClick={initPool}
      className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
    >
      Init Pool
    </button>

    <button
      onClick={takeLoan}
      className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition"
    >
      Take Loan
    </button>

    <button
      onClick={repayLoan}
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
    >
      Repay Loan
    </button>
  </div>
</div>

  );
}
