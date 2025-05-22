
"use client";

import React, { useState } from "react";
import { useAccount, useWalletClient, usePublicClient } from "wagmi";
import { richestComparisonContract } from "../utils/contract";
import { Loader2, Rocket, Users, Crown, Copy, CheckCircle, AlertCircle } from "lucide-react";
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
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const validateAddress = (addr) => {
    return addr && isAddress(addr);
  };

  const handleDeploy = async () => {
    try {
      setError("");
      setLoading(true);

      
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

      
      const hash = await walletClient.deployContract({
        abi: richestComparisonContract.abi.abi,
        bytecode: richestComparisonContract.bytecode.bytecode,
        args: [alice, bob, eve],
        account: address,
      });

      console.log("Deployment transaction hash:", hash);

      
      const receipt = await publicClient.waitForTransactionReceipt({ 
        hash,
        confirmations: 1
      });

      console.log("Transaction receipt:", receipt);

      if (receipt?.contractAddress) {
        setContractAddress(receipt.contractAddress);
        
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

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(contractAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const isFormValid = validateAddress(alice) && validateAddress(bob) && validateAddress(eve);

  const participants = [
    { name: "Alice", value: alice, setValue: setAlice, icon: "👑", color: "from-pink-400 to-purple-500" },
    { name: "Bob", value: bob, setValue: setBob, icon: "💎", color: "from-blue-400 to-cyan-500" },
    { name: "Eve", value: eve, setValue: setEve, icon: "⚡", color: "from-yellow-400 to-orange-500" }
  ];

  return (
    <div className="space-y-6">
     
     

      
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-blue-400" />
          <span className="text-white font-medium">Elite Participants</span>
        </div>

        {participants.map((participant, index) => (
          <div key={participant.name} className="space-y-2">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 bg-gradient-to-r ${participant.color} rounded-lg flex items-center justify-center text-sm font-bold text-white`}>
                {participant.icon}
              </div>
              <label className="text-white font-medium">{participant.name}</label>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder={`${participant.name}'s wallet address (0x...)`}
                className={`w-full p-4 rounded-xl bg-black/30 backdrop-blur-sm text-white border-2 transition-all duration-300 placeholder-blue-300/60 focus:outline-none ${
                  participant.value && !validateAddress(participant.value)
                    ? 'border-red-500/70 bg-red-500/10'
                    : participant.value && validateAddress(participant.value)
                    ? 'border-green-500/70 bg-green-500/10'
                    : 'border-blue-400/30 hover:border-blue-400/50 focus:border-blue-400'
                }`}
                value={participant.value}
                onChange={(e) => participant.setValue(e.target.value.trim())}
              />
              {participant.value && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {validateAddress(participant.value) ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  )}
                </div>
              )}
            </div>
            {participant.value && !validateAddress(participant.value) && (
              <p className="text-red-400 text-xs ml-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Invalid Ethereum address format
              </p>
            )}
          </div>
        ))}
      </div>

      
      <div className="pt-4">
        <button
          onClick={handleDeploy}
          disabled={!isConnected || loading || !isFormValid}
          className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform ${
            !isConnected || loading || !isFormValid
              ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Deploying Contract...</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-200"></div>
              </div>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Rocket className="w-5 h-5" />
              Launch Millionaires Contract
            </span>
          )}
        </button>
      </div>

      
      {!isConnected && (
        <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-yellow-400">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Wallet Connection Required</span>
          </div>
          <p className="text-yellow-300/80 text-sm mt-1">
            Connect your wallet to deploy the comparison Contract
          </p>
        </div>
      )}

      
      {contractAddress && (
        <div className="bg-green-500/10 border border-green-400/30 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
              <Crown className="w-6 h-6 text-white animate-bounce" />
            </div>
            <div>
              <h4 className="text-green-400 font-bold text-lg">Contract Deployed Successfully!</h4>
              <p className="text-green-300/80 text-sm">The millionaires dilemma contract is now live</p>
            </div>
          </div>
          
          <div className="bg-black/20 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-green-400 font-medium text-sm">Contract Address:</span>
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-green-300 text-xs bg-black/30 p-2 rounded font-mono break-all">
                {contractAddress}
              </code>
              <button
                onClick={handleCopyAddress}
                className="bg-green-600/80 hover:bg-green-600 px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 text-white text-xs font-medium"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      
      {error && (
        <div className="bg-red-500/10 border border-red-400/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h4 className="text-red-400 font-medium">Deployment Failed</h4>
              <p className="text-red-300/80 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeployRichest;