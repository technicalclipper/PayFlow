"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Wallet, ArrowRight, Copy, Check, ExternalLink, Shield, Clock } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import AnimatedCheckmark from "@/components/ui/AnimatedCheckmark";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

type RedeemState = "idle" | "loading" | "success" | "error";

const SALARY_AMOUNT = 3000;
const EMPLOYEE_NAME = "Alice Johnson";

export default function RedeemPage() {
  const [walletAddress, setWalletAddress] = useState("");
  const [state, setState] = useState<RedeemState>("idle");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);

  const isValidAddress = walletAddress.length >= 10;

  const handleClaim = useCallback(async () => {
    if (!isValidAddress) { setError("Please enter a valid wallet address"); return; }
    setError("");
    setState("loading");
    await new Promise((r) => setTimeout(r, 2500));
    setState("success");
    setConfettiActive(true);
  }, [isValidAddress]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [walletAddress]);

  useEffect(() => {
    if (confettiActive) {
      const timer = setTimeout(() => setConfettiActive(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [confettiActive]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-blue/8 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-accent-purple/8 rounded-full blur-[120px] pointer-events-none" />

      {/* Confetti */}
      <AnimatePresence>
        {confettiActive && (
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ x: typeof window !== "undefined" ? window.innerWidth / 2 : 500, y: typeof window !== "undefined" ? window.innerHeight / 2 : 400, scale: 0, rotate: 0 }}
                animate={{ x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000), y: -100, scale: [0, 1, 0.5], rotate: Math.random() * 720 - 360 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2 + Math.random() * 2, delay: Math.random() * 0.5, ease: "easeOut" }}
                className="absolute w-2.5 h-2.5 rounded-sm"
                style={{ backgroundColor: ["#4F8CFF", "#7C5CFF", "#22C55E", "#F59E0B", "#EF4444", "#ffffff"][Math.floor(Math.random() * 6)] }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }} className="w-full max-w-md relative z-10">
        <div className="bg-[#0f1420]/90 backdrop-blur-2xl border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
          {/* Header */}
          <div className="px-6 pt-6 pb-0 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center"><Zap className="w-4 h-4 text-white" /></div>
              <div>
                <span className="font-bold text-sm tracking-tight">PayFlow</span>
                <p className="text-[10px] text-text-muted">Salary Voucher</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-text-muted"><Shield className="w-3 h-3" /> Secured</div>
          </div>

          <AnimatePresence mode="wait">
            {state !== "success" ? (
              <motion.div key="claim-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="p-6 sm:p-8">
                <div className="text-center mb-8">
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
                    <p className="text-xs uppercase tracking-widest text-text-muted mb-1">{EMPLOYEE_NAME}</p>
                    <div className="text-6xl sm:text-7xl font-bold tracking-tighter my-3">
                      <AnimatedCounter end={SALARY_AMOUNT} duration={2} className="gradient-text" />
                    </div>
                    <p className="text-base text-text-secondary font-medium">USDC</p>
                  </motion.div>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="inline-flex items-center gap-1.5 mt-4 px-3 py-1.5 rounded-full bg-success/10 text-success text-xs font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                    Available to Claim
                  </motion.div>
                </div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-4">
                  <div className="relative">
                    <Input placeholder="Enter your wallet address (0x...)" icon={<Wallet className="w-4 h-4" />} value={walletAddress} onChange={(e) => { setWalletAddress(e.target.value); setError(""); }} error={error} />
                    {walletAddress && (
                      <button onClick={handleCopy} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors">
                        {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                  <Button size="lg" className="w-full" onClick={handleClaim} loading={state === "loading"} disabled={!walletAddress} icon={state !== "loading" ? <ArrowRight className="w-5 h-5" /> : undefined}>
                    {state === "loading" ? "Processing Transfer..." : "Claim Salary"}
                  </Button>
                  <Button variant="secondary" size="md" className="w-full">
                    <Wallet className="w-4 h-4 mr-2" /> Use my wallet
                  </Button>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-6 flex items-center justify-center gap-4 text-xs text-text-muted">
                  <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> Expires in 72h</div>
                  <div className="w-px h-3 bg-white/10" />
                  <div className="flex items-center gap-1"><Shield className="w-3 h-3" /> One-time use</div>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }} className="p-6 sm:p-8 text-center">
                <AnimatedCheckmark size={80} className="mb-4" />
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                  <h2 className="text-xl font-bold mb-2">Salary Successfully Transferred!</h2>
                  <p className="text-sm text-text-secondary mb-6">{SALARY_AMOUNT.toLocaleString()} USDC has been sent to your wallet</p>
                  <div className="bg-white/[0.03] rounded-xl p-4 mb-6 space-y-3 text-left">
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Amount</span>
                      <span className="font-semibold text-success">{SALARY_AMOUNT.toLocaleString()} USDC</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">To</span>
                      <span className="font-mono text-xs truncate max-w-[200px]">{walletAddress}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Status</span>
                      <span className="text-success font-medium flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Confirmed</span>
                    </div>
                  </div>
                  <Button variant="secondary" className="w-full" icon={<ExternalLink className="w-4 h-4" />}>View Transaction</Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="px-6 py-3 border-t border-white/[0.05] text-center text-[11px] text-text-muted">Powered by Circle & PayFlow</div>
        </div>
      </motion.div>
    </div>
  );
}
