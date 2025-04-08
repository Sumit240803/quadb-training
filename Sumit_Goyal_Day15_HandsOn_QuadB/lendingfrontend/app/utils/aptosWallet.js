export const connectToPetra = async () => {
    if ('aptos' in window) {
      const wallet = window.aptos;
  
      try {
        const connected = await wallet.connect();
        const account = await wallet.account();
        return account;
      } catch (err) {
        console.error('User rejected the request:', err);
        throw err;
      }
    } else {
      alert('Petra Wallet is not installed');
    }
  };
  