const MODULE_ADDRESS = "0xc6aa93bf284dcb72e597e1be9f1df3035f0f3ef676e9a465d580dd665bcf5bca";
const MODULE_NAME = "lending";

// Generic transaction caller
export const callTransaction = async (funcName, args = []) => {
  const payload = {
    type: "entry_function_payload",
    function: `${MODULE_ADDRESS}::${MODULE_NAME}::${funcName}`,
    type_arguments: [],
    arguments: args,
  };

  const tx = await window.aptos.signAndSubmitTransaction({payload});
  await window.aptos.waitForTransaction({ transactionHash: tx.hash });
  return tx;
};
