import { useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { toast } from "@/components/ui/use-toast";
import { aptosClient } from "@/utils/aptosClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { writeMessageSimple, writeMessageComplex, writeMessageFailing } from "@/entry-functions/writeMessage";

type TransactionResult = {
  type: string;
  hash: string;
  gasUsed: string;
  maxGasAmount: string;
  gasRefund: string;
  success: boolean;
  error?: string;
};

export function GasRefundDemo() {
  const { account, signAndSubmitTransaction } = useWallet();
  const [messageContent, setMessageContent] = useState<string>("Test message");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [transactionResults, setTransactionResults] = useState<TransactionResult[]>([]);

  const executeTransaction = async (type: string, transactionFn: any) => {
    if (!account || !messageContent) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please connect wallet and enter a message",
      });
      return;
    }

    setIsLoading(true);
    try {
      const committedTransaction = await signAndSubmitTransaction(
        transactionFn({ content: messageContent })
      );

      let success = true;
      let error = "";
      let txnResult: any;

      try {
        await aptosClient().waitForTransaction({ transactionHash: committedTransaction.hash });
        txnResult = await aptosClient().getTransactionByHash({ transactionHash: committedTransaction.hash });
      } catch (e: any) {
        success = false;
        error = e.message || "Transaction failed";
        try {
          txnResult = await aptosClient().getTransactionByHash({ transactionHash: committedTransaction.hash });
        } catch (err) {
          console.error("Failed to get transaction details:", err);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to get transaction details",
          });
          setIsLoading(false);
          return;
        }
      }

      const gasUsed = txnResult.gas_used || "0";
      const maxGasAmount = txnResult.max_gas_amount || "0";
      const gasRefund = BigInt(maxGasAmount) - BigInt(gasUsed);

      const result: TransactionResult = {
        type,
        hash: committedTransaction.hash,
        gasUsed,
        maxGasAmount,
        gasRefund: gasRefund.toString(),
        success,
        error,
      };

      setTransactionResults(prev => [result, ...prev]);

      toast({
        title: success ? "Success 🚀" : "Transaction Failed 💥",
        description: `Transaction ${success ? "succeeded" : "failed"}, hash: ${committedTransaction.hash}`,
        variant: success ? "default" : "destructive",
      });
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to submit transaction",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <CardHeader className="bg-gradient-to-r from-pink-500 to-yellow-400 p-6 rounded-xl shadow-lg text-white">
        <CardTitle className="text-3xl font-extrabold drop-shadow-md">🌟 Gas Refund Demo 🌟</CardTitle>
      </CardHeader>

      <CardContent className="bg-white p-6 rounded-xl shadow-xl border border-pink-400 flex flex-col gap-4">
        <div>
          <label className="block text-lg font-semibold text-pink-600 mb-2">💬 Message Content</label>
          <Input
            className="border-pink-400 focus:ring-2 focus:ring-yellow-300 rounded-lg text-pink-700 font-semibold"
            disabled={!account || isLoading}
            value={messageContent}
            placeholder="Type your vibrant message!"
            onChange={(e) => setMessageContent(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 rounded-xl shadow-md transition-all duration-200"
            disabled={!account || isLoading || messageContent.length === 0}
            onClick={() => executeTransaction("Simple", writeMessageSimple)}
          >
            💖 Simple
          </Button>
          <Button
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 rounded-xl shadow-md transition-all duration-200"
            disabled={!account || isLoading || messageContent.length === 0}
            onClick={() => executeTransaction("Complex", writeMessageComplex)}
          >
            🌈 Complex
          </Button>
          <Button
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-xl shadow-md transition-all duration-200"
            disabled={!account || isLoading || messageContent.length === 0}
            onClick={() => executeTransaction("Failing", writeMessageFailing)}
          >
            ⚠️ Failing
          </Button>
        </div>

        {transactionResults.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-bold text-purple-600 mb-4">📜 Transaction Results</h3>
            <div className="space-y-4">
              {transactionResults.map((result, index) => (
                <Card
                  key={index}
                  className={`border-l-8 ${
                    result.success ? "border-green-500" : "border-red-500"
                  } bg-gradient-to-br from-white via-yellow-100 to-pink-100 rounded-xl shadow-md`}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between">
                        <span className="font-bold text-purple-700">{result.type} Tx</span>
                        <span className={result.success ? "text-green-600" : "text-red-600 font-semibold"}>
                          {result.success ? "✅ Success" : "❌ Failed"}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 truncate">
                        Hash: <span className="font-mono">{result.hash}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-2 text-center">
                        <div className="bg-pink-100 p-2 rounded-xl">
                          <div className="text-xs text-pink-600 font-semibold">⛽ Gas Used</div>
                          <div className="font-bold text-pink-800">{result.gasUsed}</div>
                        </div>
                        <div className="bg-yellow-100 p-2 rounded-xl">
                          <div className="text-xs text-yellow-600 font-semibold">🚀 Max Gas</div>
                          <div className="font-bold text-yellow-800">{result.maxGasAmount}</div>
                        </div>
                        <div className="bg-green-100 p-2 rounded-xl">
                          <div className="text-xs text-green-600 font-semibold">💸 Gas Refund</div>
                          <div className="font-bold text-green-800">{result.gasRefund}</div>
                        </div>
                      </div>
                      {!result.success && result.error && (
                        <div className="mt-2 text-sm text-red-600">
                          ❗ Error: {result.error}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </div>
  );
}
