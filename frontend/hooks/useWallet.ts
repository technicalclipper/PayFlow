"use client";

import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";

const ARC_CHAIN_ID = 5042002;
const ARC_CHAIN_ID_HEX = "0x4CEF52";

const ARC_TESTNET_PARAMS = {
  chainId: ARC_CHAIN_ID_HEX,
  chainName: "Arc Testnet",
  rpcUrls: ["https://rpc.testnet.arc.network"],
  nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 18 },
  blockExplorerUrls: ["https://testnet.arcscan.app"],
};

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [connecting, setConnecting] = useState(false);

  const isConnected = !!address;
  const isCorrectChain = chainId === ARC_CHAIN_ID;

  const fetchBalance = useCallback(async (addr: string) => {
    try {
      const p = new ethers.BrowserProvider((window as any).ethereum);
      const bal = await p.getBalance(addr);
      setBalance(Number(ethers.formatEther(bal)).toFixed(2));
    } catch {
      setBalance("0.00");
    }
  }, []);

  const setupProvider = useCallback(async (addr: string) => {
    try {
      const p = new ethers.BrowserProvider((window as any).ethereum);
      const s = await p.getSigner();
      setProvider(p);
      setSigner(s);
    } catch {
      setProvider(null);
      setSigner(null);
    }
  }, []);

  const handleAccountsChanged = useCallback((accounts: string[]) => {
    if (accounts.length === 0) {
      setAddress(null);
      setProvider(null);
      setSigner(null);
      setBalance(null);
    } else {
      const addr = accounts[0];
      setAddress(addr);
      setupProvider(addr);
    }
  }, [setupProvider]);

  const handleChainChanged = useCallback((chainIdHex: string) => {
    const id = parseInt(chainIdHex, 16);
    setChainId(id);
    if (id === ARC_CHAIN_ID && address) {
      fetchBalance(address);
      setupProvider(address);
    }
  }, [address, fetchBalance, setupProvider]);

  // Auto-detect on mount
  useEffect(() => {
    const ethereum = (window as any).ethereum;
    if (!ethereum) return;

    ethereum.request({ method: "eth_accounts" }).then((accounts: string[]) => {
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        setupProvider(accounts[0]);
      }
    }).catch(() => {});

    ethereum.request({ method: "eth_chainId" }).then((hex: string) => {
      setChainId(parseInt(hex, 16));
    }).catch(() => {});
  }, [setupProvider]);

  // Fetch balance when chain is correct and address exists
  useEffect(() => {
    if (isCorrectChain && address) {
      fetchBalance(address);
    }
  }, [isCorrectChain, address, fetchBalance]);

  // Listen for events
  useEffect(() => {
    const ethereum = (window as any).ethereum;
    if (!ethereum) return;

    ethereum.on("accountsChanged", handleAccountsChanged);
    ethereum.on("chainChanged", handleChainChanged);

    return () => {
      ethereum.removeListener("accountsChanged", handleAccountsChanged);
      ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, [handleAccountsChanged, handleChainChanged]);

  const connect = useCallback(async () => {
    const ethereum = (window as any).ethereum;
    if (!ethereum) {
      alert("Please install MetaMask to use PayFlow");
      return;
    }

    setConnecting(true);
    try {
      const accounts: string[] = await ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        setAddress(accounts[0]);
        await setupProvider(accounts[0]);

        const hex: string = await ethereum.request({ method: "eth_chainId" });
        const currentId = parseInt(hex, 16);
        setChainId(currentId);

        if (currentId === ARC_CHAIN_ID) {
          fetchBalance(accounts[0]);
        }
      }
    } catch {
      // User rejected
    } finally {
      setConnecting(false);
    }
  }, [setupProvider, fetchBalance]);

  const disconnect = useCallback(() => {
    setAddress(null);
    setChainId(null);
    setBalance(null);
    setProvider(null);
    setSigner(null);
  }, []);

  const switchToArc = useCallback(async () => {
    const ethereum = (window as any).ethereum;
    if (!ethereum) return;

    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: ARC_CHAIN_ID_HEX }],
      });
    } catch (err: any) {
      if (err?.code === 4902) {
        try {
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [ARC_TESTNET_PARAMS],
          });
        } catch {
          // User rejected adding chain
        }
      }
    }
  }, []);

  return {
    address,
    chainId,
    isConnected,
    isCorrectChain,
    balance,
    provider,
    signer,
    connecting,
    connect,
    disconnect,
    switchToArc,
  };
}
