"use client";

import React, { useState } from "react";
import { useAccount, useWalletClient, usePublicClient } from "wagmi";
import { richestComparisonContract } from "../utils/contract";
import { Loader2, UploadCloud } from "lucide-react";
import { isAddress } from "viem";
import { useContract} from "@/context/contract-context";

const DeployRichest = () => {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { setContractAddress, contractAddress } = useContract();

  const [alice, setAlice] = useState("");
  const [bob, setBob] = useState("");
  const [eve, setEve] = useState("");
  const [loading, setLoading] = useState(false);
  //const [contractAddress, setContractAddress] = useState("");
  const [error, setError] = useState("");

  const validateAddress = (addr) => {
    return addr && isAddress(addr);
  };

  const handleDeploy = async () => {
    try {
      setError("");
      setLoading(true);

      // Validate all addresses
      if (!validateAddress(alice)) {
        throw new Error("Alice address is invalid");
      }
      if (!validateAddress(bob)) {
        throw new Error("Bob address is invalid");
      }
      if (!validateAddress(eve)) {
        throw new Error("Eve address is invalid");
      }

      if (!walletClient) {
        throw new Error("Wallet not connected");
      }

      // Deploy contract using walletClient
      const hash = await walletClient.deployContract({
        abi: richestComparisonContract.abi.abi,
        bytecode: richestComparisonContract.bytecode.bytecode,
        args: [alice, bob, eve],
        account: address,
      });

      console.log("Deployment transaction hash:", hash);

      // Wait for transaction receipt
      const receipt = await publicClient.waitForTransactionReceipt({ 
        hash,
        confirmations: 1
      });

      console.log("Transaction receipt:", receipt);

      if (receipt?.contractAddress) {
        setContractAddress(receipt.contractAddress);
        //localStorage.setItem("richestAddress", receipt.contractAddress);
      } else {
        throw new Error("Contract address not found in receipt");
      }
    } catch (err) {
      console.error("Deploy error:", err);
      setError(err?.message || err?.shortMessage || "Deployment failed");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = validateAddress(alice) && validateAddress(bob) && validateAddress(eve);

  return (
    <div className="bg-gray-800 p-4 rounded-xl space-y-4">
      <h2 className="text-white text-xl font-semibold flex items-center gap-2">
        <UploadCloud className="w-5 h-5 text-blue-400" />
        Deploy RichestComparison
      </h2>

      <div className="space-y-3">
        <div>
          <input
            type="text"
            placeholder="Alice address (0x...)"
            className={`w-full p-2 rounded bg-gray-700 text-white border ${
              alice && !validateAddress(alice) 
                ? 'border-red-500' 
                : 'border-gray-600'
            }`}
            value={alice}
            onChange={(e) => setAlice(e.target.value.trim())}
          />
          {alice && !validateAddress(alice) && (
            <p className="text-red-400 text-xs mt-1">Invalid Ethereum address</p>
          )}
        </div>

        <div>
          <input
            type="text"
            placeholder="Bob address (0x...)"
            className={`w-full p-2 rounded bg-gray-700 text-white border ${
              bob && !validateAddress(bob) 
                ? 'border-red-500' 
                : 'border-gray-600'
            }`}
            value={bob}
            onChange={(e) => setBob(e.target.value.trim())}
          />
          {bob && !validateAddress(bob) && (
            <p className="text-red-400 text-xs mt-1">Invalid Ethereum address</p>
          )}
        </div>

        <div>
          <input
            type="text"
            placeholder="Eve address (0x...)"
            className={`w-full p-2 rounded bg-gray-700 text-white border ${
              eve && !validateAddress(eve) 
                ? 'border-red-500' 
                : 'border-gray-600'
            }`}
            value={eve}
            onChange={(e) => setEve(e.target.value.trim())}
          />
          {eve && !validateAddress(eve) && (
            <p className="text-red-400 text-xs mt-1">Invalid Ethereum address</p>
          )}
        </div>
      </div>

      <button
        onClick={handleDeploy}
        disabled={!isConnected || loading || !isFormValid}
        className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Deploying Contract...
          </span>
        ) : (
          "Deploy Contract"
        )}
      </button>

      {!isConnected && (
        <p className="text-yellow-400 text-sm text-center">
          Please connect your wallet to deploy the contract
        </p>
      )}

      {contractAddress && (
        <div className="bg-green-900/20 border border-green-500 rounded p-3">
          <p className="text-green-400 text-sm font-semibold">
            ✅ Contract deployed successfully!
          </p>
          <p className="text-green-300 text-xs break-all mt-2">
            <span className="font-medium">Address:</span> {contractAddress}
          </p>
          <button
            onClick={() => navigator.clipboard.writeText(contractAddress)}
            className="mt-2 text-xs bg-green-600 hover:bg-green-700 px-2 py-1 rounded transition-colors"
          >
            Copy Address
          </button>
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

export default DeployRichest;