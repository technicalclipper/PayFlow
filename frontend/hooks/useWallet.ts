"use client";

import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";

const ARC_TESTNET = {
  chainId: "0x4CEC72", // 5042002 in hex
  chainName: "Arc Testnet",
  rpcUrls: ["https://rpc.testnet.arc.network"],
  nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 18 },
  blockExplorerUrls: ["https://testnet.arcscan.app"],
};

interface WalletState {
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
  isCorrectChain: boolean;
  balance: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
}

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    address: null,
    chainId: null,
    isConnected: false,
    isCorrectChain: false,
    balance: null,
    provider: null,
    signer: null,
  });
  const [connecting, setConnecting] = useState(false);

  const updateState = useCallback(async (ethereum: any) => {
    try {
      const provider = new ethers.BrowserProvider(ethereum);
      const accounts = await provider.listAccounts();

      if (accounts.length === 0) {
        setState({
          address: null, chainId: null, isConnected: false,
          isCorrectChain: false, balance: null, provider: null, signer: null,
        });
        return;
      }

      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);
      const isCorrectChain = chainId === 5042002;

      let balance: string | null = null;
      if (isCorrectChain) {
        const bal = await provider.getBalance(address);
        balance = Number(ethers.formatEther(bal)).toFixed(2);
      }

      setState({
        address, chainId, isConnected: true,
        isCorrectChain, balance, provider, signer,
      });
    } catch {
      setState({
        address: null, chainId: null, isConnected: false,
        isCorrectChain: false, balance: null, provider: null, signer: null,
      });
    }
  }, []);

  const connect = useCallback(async () => {
    const ethereum = (window as any).ethereum;
    if (!ethereum) {
      alert("Please install MetaMask to use PayFlow");
      return;
    }

    setConnecting(true);
    try {
      await ethereum.request({ method: "eth_requestAccounts" });
      await updateState(ethereum);
    } catch (err: any) {
      console.error("Wallet connect failed:", err);
    } finally {
      setConnecting(false);
    }
  }, [updateState]);

  const disconnect = useCallback(() => {
    setState({
      address: null, chainId: null, isConnected: false,
      isCorrectChain: false, balance: null, provider: null, signer: null,
    });
  }, []);

  const switchToArc = useCallback(async () => {
    const ethereum = (window as any).ethereum;
    if (!ethereum) return;

    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: ARC_TESTNET.chainId }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [ARC_TESTNET],
        });
      }
    }
    await updateState(ethereum);
  }, [updateState]);

  useEffect(() => {
    const ethereum = (window as any).ethereum;
    if (!ethereum) return;

    ethereum.request({ method: "eth_accounts" }).then((accounts: string[]) => {
      if (accounts.length > 0) updateState(ethereum);
    });

    const handleAccountsChanged = () => updateState(ethereum);
    const handleChainChanged = () => updateState(ethereum);

    ethereum.on("accountsChanged", handleAccountsChanged);
    ethereum.on("chainChanged", handleChainChanged);

    return () => {
      ethereum.removeListener("accountsChanged", handleAccountsChanged);
      ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, [updateState]);

  return { ...state, connect, disconnect, switchToArc, connecting };
}
