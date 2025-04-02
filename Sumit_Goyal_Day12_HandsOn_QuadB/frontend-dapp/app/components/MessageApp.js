"use client";

import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { contractABI, contractAddress } from "../utils/constants";

const MessageApp = () => {
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState("");
  const [messages, setMessages] = useState([]);
  const [walletConnected, setWalletConnected] = useState(false);
  const [account, setAccount] = useState(""); // Store user's account

  let provider, signer, contract;

  async function connectWallet() {
    if (!window.ethereum) return alert("Please install MetaMask");

    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner(); // 🔹 FIX: Await signer
    contract = new ethers.Contract(contractAddress, contractABI, signer);

    const accounts = await provider.send("eth_requestAccounts", []);
    setAccount(accounts[0]); // Store the first account
    setWalletConnected(true);

    fetchMessages();
  }

  async function previewMessage() {
    if (!message) return;
    provider = new ethers.BrowserProvider(window.ethereum);
    contract = new ethers.Contract(contractAddress, contractABI, provider);
    const previewText = await contract.previewMessage(message);
    setPreview(previewText);
  }

  async function sendMessage() {
    if (!message) return;
    if (!walletConnected) return alert("Connect your wallet first!");

    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner(); // 🔹 FIX: Await signer
    contract = new ethers.Contract(contractAddress, contractABI, signer);

    try {
      const tx = await contract.sendMessage(message);
      await tx.wait();

      setMessage("");
      setPreview("");
      fetchMessages(); // Refresh stored messages
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  }

  async function fetchMessages() {
    provider = new ethers.BrowserProvider(window.ethereum);
    contract = new ethers.Contract(contractAddress, contractABI, provider);

    const msgs = await contract.getMessage();

    // 🔹 FIX: Convert sender (BigInt) to string
    const formattedMessages = msgs.map((msg) => ({
      sender: msg.sender.toString(),
      content: msg.content,
    }));

    setMessages(formattedMessages);
  }

  useEffect(() => {
    if (walletConnected) fetchMessages();
  }, [walletConnected]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">📩 Decentralized Messaging</h1>

      {!walletConnected ? (
        <button
          onClick={connectWallet}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Connect Wallet
        </button>
      ) : (
        <>
          <p>Connected as: {account}</p>
          <textarea
            className="w-full p-2 border rounded mt-4"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={previewMessage}
              className="bg-yellow-500 px-4 py-2 text-white rounded"
            >
              Preview
            </button>
            <button
              onClick={sendMessage}
              className="bg-green-600 px-4 py-2 text-white rounded"
            >
              Send
            </button>
          </div>

          {preview && (
            <div className="mt-4 bg-yellow-200 p-2 rounded">
              <strong>Preview:</strong> {preview}
            </div>
          )}

          <h2 className="mt-6 text-xl font-bold">📜 Stored Messages</h2>
          {messages.length > 0 ? (
            <ul className="mt-2">
              {messages.map((msg, index) => (
                <li key={index} className="bg-white p-2 rounded shadow mt-2">
                  <strong>{msg.sender.slice(0, 6)}...{msg.sender.slice(-4)}</strong>: {msg.content}
                </li>
              ))}
            </ul>
          ) : (
            <p>No messages stored yet.</p>
          )}
        </>
      )}
    </div>
  );
};

export default MessageApp;
