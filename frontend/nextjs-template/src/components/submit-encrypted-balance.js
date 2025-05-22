
import React, { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { encryptValue } from "@/utils/inco-lite";
import { useContract } from "@/context/contract-context"; // adjust path as needed
import { parseEther } from "viem";
import { Loader2, Send } from "lucide-react";

const SubmitEncryptedBalance = () => {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const { contractAddress, isContractDeployed } = useContract();

  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const submit = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess(false);

      if (!contractAddress) {
        throw new Error("No contract deployed. Please deploy a contract first.");
      }

      if (!amount || parseFloat(amount) <= 0) {
        throw new Error("Please enter a valid amount");
      }

      const parsed = parseEther(amount);
      const encrypted = await encryptValue({
        value: parsed,
        address,
        contractAddress: contractAddress,
      });

      await writeContractAsync({
        address: contractAddress,
        abi: [ 
          {
            inputs: [{ internalType: "bytes", name: "valueInput", type: "bytes" }],
            name: "submitEncryptedBalance",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
        functionName: "submitEncryptedBalance",
        args: [encrypted],
      });

      setAmount("");
      setSuccess(true);
      
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to submit encrypted balance");
    } finally {
      setLoading(false);
    }
  };

  if (!isContractDeployed) {
    return (
      <div className="space-y-4 p-4 bg-gray-800 rounded-xl">
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <Send className="w-12 h-12 mx-auto opacity-50" />
          </div>
          <h3 className="text-white text-lg font-semibold mb-2">
            No Contract Deployed
          </h3>
          <p className="text-gray-400 text-sm">
            Please deploy a RichestComparison contract first to submit encrypted balances.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 bg-gray-800 rounded-xl">
      <div className="flex items-center gap-2 mb-4">
        <Send className="w-5 h-5 text-green-400" />
        <h3 className="text-white text-lg font-semibold">Submit Encrypted Balance</h3>
      </div>

      <div className="bg-gray-700/50 rounded p-3 mb-4">
        <p className="text-gray-300 text-sm">
          <span className="font-medium">Contract:</span> {contractAddress.slice(0, 10)}...{contractAddress.slice(-8)}
        </p>
      </div>

      <div>
        <input
          type="number"
          placeholder="Enter your balance (ETH)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
          disabled={loading}
          min="0"
          step="0.001"
        />
      </div>

      <button
        onClick={submit}
        disabled={loading || !amount || parseFloat(amount) <= 0}
        className="bg-blue-600 text-white w-full py-3 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Encrypting & Submitting...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Submit Encrypted Balance
          </>
        )}
      </button>

      {success && (
        <div className="bg-green-900/20 border border-green-500 rounded p-3">
          <p className="text-green-400 text-sm">
            ✅ Encrypted balance submitted successfully!
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-900/20 border border-red-500 rounded p-3">
          <p className="text-red-400 text-sm">❌ {error}</p>
        </div>
      )}
    </div>
  );
};

export default SubmitEncryptedBalance;