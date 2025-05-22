import React, { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { encryptValue } from "@/utils/inco-lite"; // adjust if needed
import { CONTRACT_ADDRESS } from "@/utils/contract"; // your RichestComparison address
import { parseEther } from "viem";

const SubmitEncryptedBalance = () => {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    try {
      setLoading(true);
      setError("");

      const parsed = parseEther(amount);
      const encrypted = await encryptValue({
        value: parsed,
        address,
        contractAddress: CONTRACT_ADDRESS,
      });

      await writeContractAsync({
        address: CONTRACT_ADDRESS,
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
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to submit encrypted balance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-gray-800 rounded-xl">
      <input
        type="number"
        placeholder="Enter your balance"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
        disabled={loading}
      />
      <button
        onClick={submit}
        disabled={loading || !amount}
        className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Encrypted Balance"}
      </button>
      {error && <p className="text-red-400">{error}</p>}
    </div>
  );
};

export default SubmitEncryptedBalance;
