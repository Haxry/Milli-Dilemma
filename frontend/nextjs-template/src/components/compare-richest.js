// import React, { useState } from "react";
// import { useWriteContract } from "wagmi";
// import { CONTRACT_ADDRESS } from "@/utils/contract";

// const CompareRichest = () => {
//   const { writeContractAsync } = useWriteContract();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const compare = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       await writeContractAsync({
//         address: CONTRACT_ADDRESS,
//         abi: [
//           {
//             inputs: [],
//             name: "compare",
//             outputs: [],
//             stateMutability: "nonpayable",
//             type: "function",
//           },
//         ],
//         functionName: "compare",
//         args: [],
//       });
//     } catch (err) {
//       console.error(err);
//       setError(err.message || "Compare failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-2 p-4 bg-gray-800 rounded-xl">
//       <button
//         onClick={compare}
//         disabled={loading}
//         className="bg-purple-600 text-white w-full py-2 rounded hover:bg-purple-700 disabled:opacity-50"
//       >
//         {loading ? "Comparing..." : "Compare Richest"}
//       </button>
//       {error && <p className="text-red-400">{error}</p>}
//     </div>
//   );
// };

// export default CompareRichest;

import React, { useState } from "react";
import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from "wagmi";
import { useContract } from "@/context/contract-context";
import { Trophy, Users, Loader2, Crown } from "lucide-react";

const CompareRichest = () => {
  const { writeContractAsync } = useWriteContract();
  const { contractAddress, isContractDeployed } = useContract();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentStep, setCurrentStep] = useState("");
  const [winner, setWinner] = useState(null);
  const [showWinner, setShowWinner] = useState(false);

  // Read the richIndex from contract
  const { data: richIndex, refetch: refetchRichIndex } = useReadContract({
    address: contractAddress,
    abi: [
      {
        inputs: [],
        name: "richIndex",
        outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "richIndex",
    enabled: !!contractAddress,
  });

  const getWinnerName = (index) => {
    switch (Number(index)) {
      case 0: return "Alice";
      case 1: return "Bob"; 
      case 2: return "Eve";
      default: return "Unknown";
    }
  };

  const getWinnerColor = (index) => {
    switch (Number(index)) {
      case 0: return "text-pink-400";
      case 1: return "text-blue-400";
      case 2: return "text-green-400";
      default: return "text-gray-400";
    }
  };

  const compareAndReveal = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      setShowWinner(false);
      setWinner(null);

      if (!contractAddress) {
        throw new Error("No contract deployed. Please deploy a contract first.");
      }

      // Step 1: Call compare function
      setCurrentStep("Comparing encrypted balances...");
      const compareHash = await writeContractAsync({
        address: contractAddress,
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

      console.log("Compare transaction hash:", compareHash);

      // Wait for compare transaction to be confirmed
      setCurrentStep("Waiting for comparison to complete...");
      // Add a small delay to ensure the transaction is processed
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 2: Call revealWinner function
      setCurrentStep("Revealing winner...");
      const revealHash = await writeContractAsync({
        address: contractAddress,
        abi: [
          {
            inputs: [],
            name: "revealWinner",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
        functionName: "revealWinner",
        args: [],
      });

      console.log("Reveal transaction hash:", revealHash);

      // Step 3: Wait for reveal transaction and then read the result
      setCurrentStep("Processing reveal transaction...");
      await new Promise(resolve => setTimeout(resolve, 7000));

      // Step 4: Read the richIndex to get the winner
      setCurrentStep("Reading winner result...");
      const result = await refetchRichIndex();
      
      if (result.data !== undefined) {
        const winnerIndex = Number(result.data);
        const winnerName = getWinnerName(winnerIndex);
        setWinner({ index: winnerIndex, name: winnerName });
        setShowWinner(true);
        setSuccess(`Comparison complete! Winner revealed successfully.`);
      } else {
        // Fallback: try reading after a longer delay
        setTimeout(async () => {
          const delayedResult = await refetchRichIndex();
          if (delayedResult.data !== undefined) {
            const winnerIndex = Number(delayedResult.data);
            const winnerName = getWinnerName(winnerIndex);
            setWinner({ index: winnerIndex, name: winnerName });
            setShowWinner(true);
            setSuccess(`Comparison complete! Winner revealed successfully.`);
          }
        }, 5000);
      }
      
      setCurrentStep("");
    } catch (err) {
      console.error("Compare and reveal error:", err);
      setError(err?.message || err?.shortMessage || "Compare and reveal failed");
      setCurrentStep("");
    } finally {
      setLoading(false);
    }
  };

  if (!isContractDeployed) {
    return (
      <div className="space-y-4 p-4 bg-gray-800 rounded-xl">
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <Trophy className="w-12 h-12 mx-auto opacity-50" />
          </div>
          <h3 className="text-white text-lg font-semibold mb-2">
            No Contract Deployed
          </h3>
          <p className="text-gray-400 text-sm">
            Please deploy a RichestComparison contract first.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 bg-gray-800 rounded-xl">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-purple-400" />
        <h3 className="text-white text-lg font-semibold">Compare & Reveal Winner</h3>
      </div>

      <div className="bg-gray-700/50 rounded p-3 mb-4">
        <p className="text-gray-300 text-sm">
          <span className="font-medium">Contract:</span> {contractAddress?.slice(0, 10)}...{contractAddress?.slice(-8)}
        </p>
      </div>

      {/* Current richIndex display */}
      {richIndex !== undefined && !loading && (
        <div className="bg-blue-900/20 border border-blue-500 rounded p-3 mb-4">
          <p className="text-blue-400 text-sm">
            <span className="font-medium">Current Winner Index:</span> {Number(richIndex)} ({getWinnerName(richIndex)})
          </p>
        </div>
      )}

      <button
        onClick={compareAndReveal}
        disabled={loading}
        className="bg-purple-600 text-white w-full py-3 rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {currentStep || "Processing..."}
          </>
        ) : (
          <>
            <Users className="w-4 h-4" />
            Compare & Reveal Winner
          </>
        )}
      </button>

      {/* Loading steps */}
      {loading && currentStep && (
        <div className="bg-blue-900/20 border border-blue-500 rounded p-3">
          <p className="text-blue-400 text-sm flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            {currentStep}
          </p>
        </div>
      )}

      {/* Winner Display */}
      {showWinner && winner && (
        <div className="bg-gradient-to-r from-yellow-900/20 to-amber-900/20 border border-yellow-500 rounded p-4">
          <div className="flex items-center gap-3 mb-2">
            <Crown className="w-6 h-6 text-yellow-400" />
            <h4 className="text-yellow-400 font-bold text-lg">Winner Revealed!</h4>
          </div>
          <p className="text-white text-xl font-semibold">
            🏆 <span className={getWinnerColor(winner.index)}>{winner.name}</span> is the richest!
          </p>
          <p className="text-gray-300 text-sm mt-1">
            Winner Index: {winner.index}
          </p>
        </div>
      )}

      {success && (
        <div className="bg-green-900/20 border border-green-500 rounded p-3">
          <p className="text-green-400 text-sm">✅ {success}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-900/20 border border-red-500 rounded p-3">
          <p className="text-red-400 text-sm">❌ {error}</p>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-gray-700/30 rounded p-3 mt-4">
        <p className="text-gray-400 text-xs">
          💡 This will compare all submitted encrypted balances and automatically reveal the winner.
          The process involves two transactions: compare() and revealWinner().
        </p>
      </div>
    </div>
  );
};

export default CompareRichest;