const { ethers } = require("ethers");

let provider;
let signer;

const connectWallet=async()=>{
    if(typeof window.ethereum !== 'undefined'){
        provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts",[]);
        signer =await provider.getSigner();
        return signer;
    }else{
        console.log("No ethereum wallet found. Please install MetaMask");
    }
}

const getProvider=()=>{
    if(!provider){
        throw new Error("wallet not connected");
    }else{
        return provider;
    }
}

const getSigner=()=>{
    if(!signer){
        throw new Error("Wallet not connected");
    }else{
        return signer;
    }
}

export {connectWallet , getProvider , getSigner};