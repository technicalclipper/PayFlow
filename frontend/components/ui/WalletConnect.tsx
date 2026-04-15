"use client";

import { useWalletContext } from "@/contexts/WalletContext";
import { Wallet, ChevronDown, LogOut, AlertTriangle } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function WalletConnect() {
  const { address, isConnected, isCorrectChain, balance, connecting, connect, disconnect, switchToArc } = useWalletContext();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!isConnected) {
    return (
      <button
        onClick={connect}
        disabled={connecting}
        className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-bg text-white text-sm font-medium hover:glow-gradient transition-all duration-300 disabled:opacity-50"
      >
        <Wallet className="w-4 h-4" />
        {connecting ? "Connecting..." : "Connect Wallet"}
      </button>
    );
  }

  if (!isCorrectChain) {
    return (
      <button
        onClick={switchToArc}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-warning/10 text-warning border border-warning/20 text-sm font-medium hover:bg-warning/20 transition-all duration-300"
      >
        <AlertTriangle className="w-4 h-4" />
        Switch to Arc
      </button>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/[0.05] border border-glass-border text-sm font-medium hover:bg-white/[0.08] transition-all duration-200"
      >
        <div className="w-2 h-2 rounded-full bg-success" />
        <span className="text-text-primary">
          {address!.slice(0, 6)}...{address!.slice(-4)}
        </span>
        {balance && (
          <span className="text-text-muted text-xs">{balance} USDC</span>
        )}
        <ChevronDown className={`w-3.5 h-3.5 text-text-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 glass-card p-2 z-50">
          <div className="px-3 py-2 border-b border-glass-border mb-1">
            <p className="text-xs text-text-muted">Connected</p>
            <p className="text-sm font-mono text-text-primary mt-0.5 break-all">{address}</p>
          </div>
          {balance && (
            <div className="px-3 py-2 border-b border-glass-border mb-1">
              <p className="text-xs text-text-muted">Balance</p>
              <p className="text-sm font-semibold text-text-primary mt-0.5">{balance} USDC</p>
            </div>
          )}
          <button
            onClick={() => { disconnect(); setOpen(false); }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-error hover:bg-error/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
