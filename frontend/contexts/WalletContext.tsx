"use client";

import { createContext, useContext } from "react";
import { useWallet } from "@/hooks/useWallet";
import type { ethers } from "ethers";

interface WalletContextType {
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
  isCorrectChain: boolean;
  balance: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  connecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchToArc: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const wallet = useWallet();
  return (
    <WalletContext.Provider value={wallet}>{children}</WalletContext.Provider>
  );
}

export function useWalletContext() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWalletContext must be inside WalletProvider");
  return ctx;
}
