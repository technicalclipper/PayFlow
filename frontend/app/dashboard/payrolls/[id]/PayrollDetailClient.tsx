"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft, Calendar, DollarSign, Send, FileText,
  Wallet, CheckCircle2, ExternalLink, Loader2, LinkIcon, Gift,
} from "lucide-react";
import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import {
  markPayrollFunded,
  markPayrollDistributed,
  getPayrollTokens,
} from "@/lib/actions";
import {
  fundPayrollOnchain,
  distributePayrollOnchain,
  getOnchainPayrollInfo,
} from "@/lib/client-contract";
import { useWalletContext } from "@/contexts/WalletContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PayrollDetailClient({ payroll }: { payroll: any }) {
  const employees = payroll.payroll_employees ?? [];
  const [fundPending, setFundPending] = useState(false);
  const [distPending, setDistPending] = useState(false);
  const [tokens, setTokens] = useState<any[] | null>(null);
  const [message, setMessage] = useState("");
  const [onchainStatus, setOnchainStatus] = useState<any>(null);
  const router = useRouter();
  const { signer, provider, isConnected, isCorrectChain } = useWalletContext();

  const hasOnchain =
    payroll.onchain_payroll_id !== null &&
    payroll.onchain_payroll_id !== undefined;

  useEffect(() => {
    if (hasOnchain && provider && isCorrectChain) {
      getOnchainPayrollInfo(provider, payroll.onchain_payroll_id).then(
        (data) => setOnchainStatus(data)
      ).catch(() => {});
    }
  }, [hasOnchain, provider, isCorrectChain, payroll.onchain_payroll_id]);

  const isFunded = payroll.onchain_funded || onchainStatus?.isFunded;
  const isDistributed = payroll.status === "processed" || onchainStatus?.isDistributed;

  const handleFund = async () => {
    if (!signer || !hasOnchain) return;
    setFundPending(true);
    setMessage("");
    try {
      const { txHash } = await fundPayrollOnchain(
        signer,
        payroll.onchain_payroll_id,
        Number(payroll.total_amount)
      );
      await markPayrollFunded(payroll.id, txHash);
      setMessage(`Funded on-chain! TX: ${txHash.slice(0, 16)}...`);
      router.refresh();
    } catch (err: any) {
      setMessage(`Error: ${err?.reason || err?.message || "Funding failed"}`);
    } finally {
      setFundPending(false);
    }
  };

  const handleDistribute = async () => {
    if (!signer || !hasOnchain) return;
    setDistPending(true);
    setMessage("");
    try {
      const { txHash } = await distributePayrollOnchain(
        signer,
        payroll.onchain_payroll_id
      );
      await markPayrollDistributed(payroll.id, txHash);
      setMessage(`Distributed! Funds sent to employee wallets. TX: ${txHash.slice(0, 16)}...`);
      router.refresh();
    } catch (err: any) {
      setMessage(`Error: ${err?.reason || err?.message || "Distribution failed"}`);
    } finally {
      setDistPending(false);
    }
  };

  const handleShowTokens = async () => {
    const result = await getPayrollTokens(payroll.id);
    if (result.data) setTokens(result.data);
  };

  return (
    <div className="space-y-8">
      <div>
        <Link href="/dashboard/payrolls" className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Payrolls
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <motion.h1 initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3">
            Payroll — {new Date(payroll.payout_date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            <Badge status={payroll.status} />
          </motion.h1>
          <div className="flex gap-3 flex-wrap">
            {hasOnchain && !isFunded && (
              <Button
                variant="primary"
                size="sm"
                icon={fundPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wallet className="w-4 h-4" />}
                onClick={handleFund}
                disabled={fundPending || !isConnected || !isCorrectChain}
              >
                {fundPending ? "Funding..." : "Fund On-Chain"}
              </Button>
            )}
            {hasOnchain && isFunded && !isDistributed && (
              <Button
                variant="secondary"
                size="sm"
                icon={distPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                onClick={handleDistribute}
                disabled={distPending || !isConnected || !isCorrectChain}
              >
                {distPending ? "Distributing..." : "Distribute"}
              </Button>
            )}
            {isDistributed && (
              <Button variant="secondary" size="sm" icon={<FileText className="w-4 h-4" />} onClick={handleShowTokens}>
                Show Tokens
              </Button>
            )}
          </div>
        </div>
        {message && <p className="text-sm mt-2 text-accent-blue">{message}</p>}
      </div>

      {/* On-chain Status Banner */}
      {hasOnchain && (
        <GlassCard className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-accent-blue/10 flex items-center justify-center">
              <LinkIcon className="w-4.5 h-4.5 text-accent-blue" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">On-Chain Status</h3>
              <p className="text-xs text-text-muted">Arc Testnet — Payroll #{payroll.onchain_payroll_id}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success" />
              <span className="text-text-secondary">Created</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isFunded ? "bg-success" : "bg-text-muted"}`} />
              <span className="text-text-secondary">Funded</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isDistributed ? "bg-success" : "bg-text-muted"}`} />
              <span className="text-text-secondary">Distributed</span>
            </div>
            {payroll.onchain_tx_hash && (
              <a
                href={`https://testnet.arcscan.app/tx/${payroll.onchain_tx_hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-accent-blue hover:text-accent-blue/80 transition-colors ml-auto"
              >
                View TX <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </GlassCard>
      )}

      {!hasOnchain && (
        <GlassCard className="p-5 border-warning/20">
          <p className="text-sm text-warning">This payroll was created off-chain.</p>
        </GlassCard>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassCard className="p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-accent-blue/10 flex items-center justify-center">
              <DollarSign className="w-4.5 h-4.5 text-accent-blue" />
            </div>
            <span className="text-sm text-text-secondary">Total Amount</span>
          </div>
          <p className="text-2xl font-bold">{Number(payroll.total_amount).toLocaleString()} <span className="text-sm font-normal text-text-muted">USDC</span></p>
        </GlassCard>
        <GlassCard className="p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-accent-purple/10 flex items-center justify-center">
              <Calendar className="w-4.5 h-4.5 text-accent-purple" />
            </div>
            <span className="text-sm text-text-secondary">Payout Date</span>
          </div>
          <p className="text-2xl font-bold">{new Date(payroll.payout_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
        </GlassCard>
        <GlassCard className="p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="w-4.5 h-4.5 text-success" />
            </div>
            <span className="text-sm text-text-secondary">Redeemed</span>
          </div>
          <p className="text-2xl font-bold">{employees.filter((e: any) => e.status === "redeemed").length}<span className="text-sm font-normal text-text-muted"> / {employees.length}</span></p>
        </GlassCard>
      </div>

      {/* Tokens display */}
      {tokens && tokens.length > 0 && (
        <GlassCard className="p-5">
          <h2 className="font-semibold text-base mb-3">Redeem Tokens</h2>
          <div className="space-y-2">
            {tokens.map((t: any) => (
              <div key={t.id} className="flex items-center justify-between bg-white/[0.03] rounded-lg px-4 py-2.5 text-sm">
                <span>{t.employees?.name ?? "Unknown"} — {t.employees?.email ?? ""}</span>
                <div className="flex items-center gap-2">
                  <code className="text-xs text-accent-blue bg-accent-blue/10 px-2 py-1 rounded">/redeem/{t.token.slice(0, 12)}...</code>
                  <Link href={`/redeem/${t.token}`} target="_blank">
                    <Button variant="ghost" size="sm" icon={<Gift className="w-3.5 h-3.5" />}>
                      Test Redeem
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Employee Table */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-glass-border">
          <h2 className="font-semibold text-base">Employees</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-glass-border">
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-3">Employee</th>
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-3">Wallet</th>
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-3">Amount</th>
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-3">Status</th>
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((pe: any, i: number) => (
                <motion.tr key={pe.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + i * 0.03 }} className="border-b border-glass-border last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-xs font-bold text-white">
                        {pe.employees?.name?.split(" ").map((n: string) => n[0]).join("") ?? "?"}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{pe.employees?.name ?? "Unknown"}</p>
                        <p className="text-xs text-text-muted">{pe.employees?.email ?? ""}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {pe.employees?.wallet_address ? (
                      <a
                        href={`https://testnet.arcscan.app/address/${pe.employees.wallet_address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-accent-blue bg-accent-blue/10 px-2 py-1 rounded-md hover:underline"
                      >
                        {pe.employees.wallet_address.slice(0, 6)}...{pe.employees.wallet_address.slice(-4)}
                      </a>
                    ) : (
                      <span className="text-xs text-text-muted">No wallet</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold">{Number(pe.salary_amount).toLocaleString()} USDC</span>
                  </td>
                  <td className="px-6 py-4"><Badge status={pe.status} /></td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {pe.status === "funded" && (
                        <Link href={`/salary-slip/${pe.id}`}>
                          <Button variant="ghost" size="sm">View Slip</Button>
                        </Link>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
