"use client";

import { useAccount, useDisconnect } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useEffect, useState } from "react";
import { Wallet, LogOut, User, Crown, Zap, Shield } from "lucide-react";
import { ContractProvider } from "@/context/contract-context";
import SubmitEncryptedBalance from "@/components/submit-encrypted-balance";
import CompareComponent from "@/components/compare-richest";
import DeployRichest from "@/components/deploy-richest";

export default function Home() {
  const { isConnected, address } = useAccount();
  const { open } = useWeb3Modal();
  const { disconnect } = useDisconnect();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDisconnect = () => {
    try {
      disconnect();
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error("Disconnect error:", error);
    }
  };

  const handleConnect = () => {
    try {
      open();
    } catch (error) {
      console.error("Connect error:", error);
    }
  };

  if (!mounted)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white animate-pulse text-xl">Loading...</div>
      </div>
    );

  return (
    <div className="min-h-screen relative overflow-hidden">
      
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-64 h-64 bg-blue-400 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-32 w-48 h-48 bg-cyan-300 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-40 left-1/4 w-56 h-56 bg-blue-500 rounded-full filter blur-3xl animate-pulse delay-2000"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-indigo-400 rounded-full filter blur-3xl animate-pulse delay-500"></div>
        </div>
        
        
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1000 1000" fill="none">
            <path d="M100 200L150 100L200 300L250 150L300 400" stroke="url(#lightning1)" strokeWidth="2" className="animate-pulse"/>
            <path d="M500 100L550 250L600 50L650 300L700 150" stroke="url(#lightning2)" strokeWidth="2" className="animate-pulse delay-1000"/>
            <path d="M800 300L850 150L900 450L950 250L1000 500" stroke="url(#lightning3)" strokeWidth="2" className="animate-pulse delay-2000"/>
            <defs>
              <linearGradient id="lightning1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60A5FA"/>
                <stop offset="100%" stopColor="#3B82F6"/>
              </linearGradient>
              <linearGradient id="lightning2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22D3EE"/>
                <stop offset="100%" stopColor="#0EA5E9"/>
              </linearGradient>
              <linearGradient id="lightning3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6"/>
                <stop offset="100%" stopColor="#6366F1"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      
      <div className="relative z-10 max-w-7xl mx-auto p-6">
        
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Crown className="text-yellow-400 w-12 h-12 animate-bounce" />
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
              Millionaires
            </h1>
            <Zap className="text-blue-400 w-10 h-10 animate-pulse" />
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent mb-4">
            Dilemma
          </h2>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto leading-relaxed">
            Securely compare wealth without revealing your actual balance. 
            Built Using Inco Lightning
          </p>
        </div>

        
        <div className="flex justify-center mb-12">
          {isConnected ? (
            <div className="bg-black/30 backdrop-blur-lg border border-blue-400/30 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <User className="text-blue-400 w-6 h-6" />
                  <span className="text-white font-mono text-lg">
                    {address?.substring(0, 8)}...{address?.substring(address.length - 6)}
                  </span>
                </div>
                <button
                  onClick={handleDisconnect}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-red-500/25"
                >
                  <LogOut className="w-5 h-5" />
                  Disconnect
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleConnect}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-12 py-4 rounded-2xl transition-all duration-300 flex items-center gap-3 shadow-2xl hover:shadow-blue-500/25 text-xl font-semibold"
            >
              <Wallet className="w-6 h-6" />
              Connect Wallet
            </button>
          )}
        </div>

        {isConnected ? (
          <ContractProvider>
            
            <div className="mb-16">
              <div className="bg-black/20 backdrop-blur-lg border border-blue-400/30 rounded-3xl p-8 shadow-2xl">
                <div className="text-center mb-6">
                  <Shield className="w-12 h-12 text-blue-400 mx-auto mb-4 animate-pulse" />
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Deploy Smart Contract
                  </h3>
                  <p className="text-blue-200">
                    Initialize the secure comparison protocol
                  </p>
                </div>
                <DeployRichest />
              </div>
            </div>

            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              
              <div className="bg-black/20 backdrop-blur-lg border border-cyan-400/30 rounded-3xl p-8 shadow-2xl hover:shadow-cyan-400/20 transition-all duration-500">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Wallet className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Submit Encrypted Balance
                  </h3>
                  <p className="text-cyan-200 text-sm">
                    Securely encrypt and submit your wealth data
                  </p>
                </div>
                <SubmitEncryptedBalance />
              </div>

              
              <div className="bg-black/20 backdrop-blur-lg border border-purple-400/30 rounded-3xl p-8 shadow-2xl hover:shadow-purple-400/20 transition-all duration-500">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Compare Wealth
                  </h3>
                  <p className="text-purple-200 text-sm">
                    Discover who's the richest without revealing amounts
                  </p>
                </div>
                <CompareComponent />
              </div>
            </div>

            
            
          </ContractProvider>
        ) : (
          <div className="bg-black/20 backdrop-blur-lg border border-blue-400/30 rounded-3xl p-16 text-center shadow-2xl">
            <div className="mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <Wallet className="w-12 h-12 text-white animate-pulse" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">
                Enter the Elite Circle
              </h3>
              <p className="text-blue-200 text-lg mb-8 max-w-md mx-auto">
                Connect your wallet to participate in the most exclusive wealth comparison protocol
              </p>
            </div>
            <button
              onClick={handleConnect}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-12 py-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 text-xl font-semibold"
            >
              <Wallet className="w-6 h-6 inline mr-3" />
              Connect Wallet
            </button>
          </div>
        )}
      </div>

      
      <div className="absolute top-1/4 left-10 animate-float">
        <div className="w-4 h-4 bg-blue-400 rounded-full opacity-60"></div>
      </div>
      <div className="absolute top-1/3 right-20 animate-float delay-1000">
        <div className="w-3 h-3 bg-cyan-300 rounded-full opacity-60"></div>
      </div>
      <div className="absolute bottom-1/4 left-1/4 animate-float delay-2000">
        <div className="w-5 h-5 bg-indigo-400 rounded-full opacity-60"></div>
      </div>
    </div>
  );
}
