"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Plus, Trash2, Calendar, DollarSign, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { savePayroll } from "@/lib/actions";
import { createPayrollOnchain } from "@/lib/client-contract";
import { useWalletContext } from "@/contexts/WalletContext";
import type { Employee } from "@/lib/types";

interface PayrollEntry {
  employeeId: string;
  amount: string;
}

export default function CreatePayrollClient({ employees }: { employees: Employee[] }) {
  const [payoutDate, setPayoutDate] = useState("");
  const [entries, setEntries] = useState<PayrollEntry[]>([{ employeeId: "", amount: "" }]);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"form" | "onchain" | "saving" | "done">("form");
  const [txHash, setTxHash] = useState("");
  const router = useRouter();
  const { signer, isConnected, isCorrectChain, address } = useWalletContext();

  const addEntry = () => setEntries([...entries, { employeeId: "", amount: "" }]);
  const removeEntry = (index: number) => setEntries(entries.filter((_, i) => i !== index));
  const updateEntry = (index: number, field: keyof PayrollEntry, value: string) => {
    const updated = [...entries];
    updated[index] = { ...updated[index], [field]: value };
    setEntries(updated);
  };

  const totalAmount = entries.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

  const validEntries = entries.filter((e) => e.employeeId && parseFloat(e.amount) > 0);

  const employeeMap = new Map(employees.map((e) => [e.id, e]));
  const allHaveWallets = validEntries.every(
    (e) => employeeMap.get(e.employeeId)?.wallet_address
  );

  const handleSubmit = async () => {
    setError("");

    if (!isConnected || !isCorrectChain) {
      setError("Please connect your wallet to Arc Testnet first.");
      return;
    }
    if (!signer) {
      setError("Wallet signer not available.");
      return;
    }
    if (!payoutDate) {
      setError("Please select a payout date.");
      return;
    }
    if (validEntries.length === 0) {
      setError("Add at least one employee with an amount.");
      return;
    }
    if (!allHaveWallets) {
      setError("All selected employees must have wallet addresses for on-chain payroll.");
      return;
    }

    try {
      // Step 1: Create on-chain
      setStep("onchain");
      const wallets = validEntries.map(
        (e) => employeeMap.get(e.employeeId)!.wallet_address!
      );
      const amounts = validEntries.map((e) => parseFloat(e.amount));
      const payoutDateUnix = Math.floor(new Date(payoutDate).getTime() / 1000);

      const { payrollId, txHash: hash } = await createPayrollOnchain(
        signer,
        wallets,
        amounts,
        payoutDateUnix
      );
      setTxHash(hash);

      // Step 2: Save to Supabase
      setStep("saving");
      const result = await savePayroll({
        payoutDate,
        entries: validEntries.map((e) => ({
          employeeId: e.employeeId,
          amount: parseFloat(e.amount),
        })),
        onchainPayrollId: payrollId,
        onchainTxHash: hash,
      });

      if (result.error) {
        setError(result.error);
        setStep("form");
        return;
      }

      setStep("done");
      setTimeout(() => router.push("/dashboard/payrolls"), 2000);
    } catch (err: any) {
      setError(err?.reason || err?.message || "Transaction failed");
      setStep("form");
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <Link href="/dashboard/payrolls" className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Payrolls
        </Link>
        <motion.h1 initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-2xl sm:text-3xl font-bold tracking-tight">
          Create Payroll
        </motion.h1>
        <p className="text-text-secondary text-sm mt-1">
          Set up a new payroll — transaction will be signed from your connected wallet
        </p>
      </div>

      {/* Progress indicator during submission */}
      {step !== "form" && (
        <GlassCard className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {step === "onchain" ? (
                <Loader2 className="w-5 h-5 text-accent-blue animate-spin" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-success" />
              )}
              <span className={step === "onchain" ? "text-accent-blue font-medium" : "text-success"}>
                Creating payroll on-chain...
              </span>
            </div>
            <div className="flex items-center gap-3">
              {step === "saving" ? (
                <Loader2 className="w-5 h-5 text-accent-blue animate-spin" />
              ) : step === "done" ? (
                <CheckCircle2 className="w-5 h-5 text-success" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-glass-border" />
              )}
              <span className={step === "saving" ? "text-accent-blue font-medium" : step === "done" ? "text-success" : "text-text-muted"}>
                Saving to database...
              </span>
            </div>
            {step === "done" && (
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <span className="text-success font-medium">Payroll created! Redirecting...</span>
              </div>
            )}
            {txHash && (
              <a
                href={`https://testnet.arcscan.app/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-accent-blue hover:underline"
              >
                View transaction on ArcScan →
              </a>
            )}
          </div>
        </GlassCard>
      )}

      {step === "form" && (
        <>
          {!isConnected && (
            <GlassCard className="p-5 border-warning/20">
              <p className="text-sm text-warning">Connect your wallet (top right) to create an on-chain payroll.</p>
            </GlassCard>
          )}
          {isConnected && !isCorrectChain && (
            <GlassCard className="p-5 border-warning/20">
              <p className="text-sm text-warning">Switch to Arc Testnet to continue.</p>
            </GlassCard>
          )}

          {employees.length === 0 && (
            <GlassCard className="p-5 text-center">
              <p className="text-sm text-text-secondary mb-3">Add employees with wallet addresses first.</p>
              <Link href="/dashboard/employees"><Button variant="secondary" size="sm">Go to Employees</Button></Link>
            </GlassCard>
          )}

          <GlassCard className="p-6">
            <h2 className="font-semibold text-base mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-accent-blue" /> Payout Date
            </h2>
            <Input type="date" value={payoutDate} onChange={(e) => setPayoutDate(e.target.value)} className="max-w-xs [color-scheme:dark]" />
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-base flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-accent-purple" /> Salary Assignments
              </h2>
              <Button variant="secondary" size="sm" icon={<Plus className="w-4 h-4" />} onClick={addEntry}>Add Employee</Button>
            </div>
            <div className="space-y-4">
              {entries.map((entry, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
                  <div className="flex-1 w-full">
                    <label className="block text-xs font-medium text-text-secondary mb-1.5">Employee</label>
                    <select
                      value={entry.employeeId}
                      onChange={(e) => updateEntry(i, "employeeId", e.target.value)}
                      className="w-full bg-white/[0.03] border border-glass-border rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/30 transition-all duration-200 appearance-none"
                    >
                      <option value="" className="bg-bg-secondary">Select employee...</option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id} className="bg-bg-secondary">
                          {emp.name} — {emp.wallet_address ? `${emp.wallet_address.slice(0, 6)}...` : "⚠ No wallet"}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-full sm:w-48">
                    <Input label="Amount (USDC)" type="number" placeholder="0.00" value={entry.amount} onChange={(e) => updateEntry(i, "amount", e.target.value)} />
                  </div>
                  {entries.length > 1 && (
                    <button onClick={() => removeEntry(i)} className="p-3 text-text-muted hover:text-error transition-colors rounded-xl hover:bg-error/10">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-text-secondary">Total Payroll Amount</p>
                <p className="text-3xl font-bold mt-1">{totalAmount.toLocaleString()} <span className="text-sm font-normal text-text-muted">USDC</span></p>
              </div>
              <div className="text-right">
                <p className="text-sm text-text-secondary">Employees</p>
                <p className="text-3xl font-bold mt-1">{validEntries.length}</p>
              </div>
            </div>
            {!allHaveWallets && validEntries.length > 0 && (
              <p className="text-sm text-warning mb-4">Some employees don't have wallet addresses. Add wallets in the Employees page.</p>
            )}
            {error && <p className="text-sm text-error mb-4">{error}</p>}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="flex-1"
                onClick={handleSubmit}
                disabled={!isConnected || !isCorrectChain || !payoutDate || validEntries.length === 0 || !allHaveWallets}
              >
                {isConnected ? "Create Payroll (Sign TX)" : "Connect Wallet First"}
              </Button>
              <Link href="/dashboard/payrolls">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">Cancel</Button>
              </Link>
            </div>
          </GlassCard>
        </>
      )}
    </div>
  );
}
