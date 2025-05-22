import React, { useState } from "react";
import { useWriteContract } from "wagmi";
import { CONTRACT_ADDRESS } from "@/utils/contract";

const CompareRichest = () => {
  const { writeContractAsync } = useWriteContract();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const compare = async () => {
    try {
      setLoading(true);
      setError("");

      await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: [
          {
            inputs: [],
            name: "compare",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
        functionName: "compare",
        args: [],
      });
    } catch (err) {
      console.error(err);
      setError(err.message || "Compare failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2 p-4 bg-gray-800 rounded-xl">
      <button
        onClick={compare}
        disabled={loading}
        className="bg-purple-600 text-white w-full py-2 rounded hover:bg-purple-700 disabled:opacity-50"
      >
        {loading ? "Comparing..." : "Compare Richest"}
      </button>
      {error && <p className="text-red-400">{error}</p>}
    </div>
  );
};

export default CompareRichest;
