// import React, { useState } from "react";
// import { useWriteContract } from "wagmi";
// import { CONTRACT_ADDRESS } from "@/utils/contract";

// const RevealWinner = () => {
//   const { writeContractAsync } = useWriteContract();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const reveal = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       await writeContractAsync({
//         address: CONTRACT_ADDRESS,
//         abi: [
//           {
//             inputs: [],
//             name: "revealWinner",
//             outputs: [],
//             stateMutability: "nonpayable",
//             type: "function",
//           },
//         ],
//         functionName: "revealWinner",
//         args: [],
//       });
//     } catch (err) {
//       console.error(err);
//       setError(err.message || "Reveal failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-2 p-4 bg-gray-800 rounded-xl">
//       <button
//         onClick={reveal}
//         disabled={loading}
//         className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700 disabled:opacity-50"
//       >
//         {loading ? "Revealing..." : "Reveal Winner"}
//       </button>
//       {error && <p className="text-red-400">{error}</p>}
//     </div>
//   );
// };

// export default RevealWinner;

import React, { useState } from "react";
import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACT_ADDRESS } from "@/utils/contract";
import { formatUnits } from "viem";

const ABI = [
  {
    inputs: [],
    name: "revealWinner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "richIndex",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

const RevealWinner = () => {
  const { writeContractAsync } = useWriteContract();
  const [txHash, setTxHash] = useState(null);
  const [loading, setLoading] = useState(false);
  const [richIndex, setRichIndex] = useState(null);
  const [error, setError] = useState("");

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
    enabled: !!txHash,
    onSuccess: async () => {
      try {
        const res = await readRichIndex();
        console.log("Rich Index:", res.toString());
        setRichIndex(res.toString());
      } catch (err) {
        setError("Failed to fetch richIndex");
        console.error(err);
      }
    },
    onError: (err) => {
      setError("Transaction failed");
      console.error(err);
    },
  });

  const reveal = async () => {
    try {
      setLoading(true);
      setError("");
      setRichIndex(null);

      const tx = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: "revealWinner",
      });

      setTxHash(tx); // Save tx hash to wait for confirmation
    } catch (err) {
      console.error(err);
      setError(err.message || "Reveal failed");
    } finally {
      setLoading(false);
    }
  };

  const readRichIndex = async () => {
    const { readContract } = await import("wagmi/actions");
    return await readContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: "richIndex",
    });
  };

  return (
    <div className="space-y-4 p-4 bg-gray-800 rounded-xl">
      <button
        onClick={reveal}
        disabled={loading || isConfirming}
        className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700 disabled:opacity-50"
      >
        {loading
          ? "Sending..."
          : isConfirming
          ? "Confirming..."
          : "Reveal Winner"}
      </button>

      {richIndex !== null && (
        <div className="text-green-400 text-sm">
          🏆 Winner is at index: <span className="font-semibold">{richIndex}</span>
        </div>
      )}

      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  );
};

export default RevealWinner;
