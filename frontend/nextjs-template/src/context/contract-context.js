"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const ContractContext = createContext();

export const useContract = () => {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error('useContract must be used within a ContractProvider');
  }
  return context;
};

export const ContractProvider = ({ children }) => {
  const [contractAddress, setContractAddress] = useState('');

  // Load from localStorage on mount
  useEffect(() => {
    const savedAddress = localStorage.getItem('richestAddress');
    if (savedAddress) {
      setContractAddress(savedAddress);
    }
  }, []);

  // Save to localStorage whenever address changes
  const updateContractAddress = (address) => {
    setContractAddress(address);
    if (address) {
      localStorage.setItem('richestAddress', address);
    } else {
      localStorage.removeItem('richestAddress');
    }
  };

  const value = {
    contractAddress,
    setContractAddress: updateContractAddress,
    isContractDeployed: !!contractAddress,
  };

  return (
    <ContractContext.Provider value={value}>
      {children}
    </ContractContext.Provider>
  );
};