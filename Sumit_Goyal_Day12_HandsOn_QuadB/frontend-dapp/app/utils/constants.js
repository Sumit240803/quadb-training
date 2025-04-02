export const contractAddress = "0x5442e139508D28014FEfddE4b9DF5dF8bc095A9C";
export const contractABI = [
  {
    "inputs": [{ "internalType": "string", "name": "newMessage", "type": "string" }],
    "name": "sendMessage",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "newMessage", "type": "string" }],
    "name": "previewMessage",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getMessage",
    "outputs": [{
      "components": [{ "internalType": "address", "name": "sender", "type": "address" },
      { "internalType": "string", "name": "content", "type": "string" },
      { "internalType": "uint256", "name": "timestamp", "type": "uint256" }],
      "internalType": "struct DMessage.Message[]",
      "name": "",
      "type": "tuple[]"
    }],
    "stateMutability": "view",
    "type": "function"
  }
];
