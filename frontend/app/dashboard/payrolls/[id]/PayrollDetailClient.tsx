"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Calendar, DollarSign, Send, FileText } from "lucide-react";
import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { distributePayroll, getPayrollTokens } from "@/lib/actions";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function PayrollDetailClient({ payroll }: { payroll: any }) {
  const employees = payroll.payroll_employees ?? [];
  const [isPending, startTransition] = useTransition();
  const [tokens, setTokens] = useState<any[] | null>(null);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleDistribute = () => {
    startTransition(async () => {
      const result = await distributePayroll(payroll.id);
      if (result.error) {
        setMessage(`Error: ${result.error}`);
      } else {
        setMessage(`Distributed! ${result.tokensGenerated} redeem tokens generated.`);
        router.refresh();
      }
    });
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
          <div className="flex gap-3">
            <Button variant="secondary" size="sm" icon={<Send className="w-4 h-4" />} onClick={handleDistribute} loading={isPending} disabled={payroll.status === "processed"}>
              {payroll.status === "processed" ? "Distributed" : "Distribute"}
            </Button>
            {payroll.status === "processed" && (
              <Button variant="secondary" size="sm" icon={<FileText className="w-4 h-4" />} onClick={handleShowTokens}>
                Show Tokens
              </Button>
            )}
          </div>
        </div>
        {message && <p className="text-sm mt-2 text-accent-blue">{message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassCard className="p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-accent-blue/10 flex items-center justify-center"><DollarSign className="w-4.5 h-4.5 text-accent-blue" /></div>
            <span className="text-sm text-text-secondary">Total Amount</span>
          </div>
          <p className="text-2xl font-bold">{Number(payroll.total_amount).toLocaleString()} <span className="text-sm font-normal text-text-muted">USDC</span></p>
        </GlassCard>
        <GlassCard className="p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-accent-purple/10 flex items-center justify-center"><Calendar className="w-4.5 h-4.5 text-accent-purple" /></div>
            <span className="text-sm text-text-secondary">Payout Date</span>
          </div>
          <p className="text-2xl font-bold">{new Date(payroll.payout_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
        </GlassCard>
        <GlassCard className="p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-success/10 flex items-center justify-center"><Send className="w-4.5 h-4.5 text-success" /></div>
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
                <code className="text-xs text-accent-blue bg-accent-blue/10 px-2 py-1 rounded">/redeem/{t.token.slice(0, 12)}...</code>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      <GlassCard className="p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-glass-border"><h2 className="font-semibold text-base">Employees</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-glass-border">
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-3">Employee</th>
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-3">Wallet ID</th>
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
                  <td className="px-6 py-4"><code className="text-xs text-text-muted bg-white/5 px-2 py-1 rounded-md">{pe.employees?.wallet_id ?? "No wallet"}</code></td>
                  <td className="px-6 py-4"><span className="text-sm font-semibold">{Number(pe.salary_amount).toLocaleString()} USDC</span></td>
                  <td className="px-6 py-4"><Badge status={pe.status} /></td>
                  <td className="px-6 py-4">
                    {pe.status === "funded" && <Link href={`/salary-slip/${pe.id}`}><Button variant="ghost" size="sm">View Slip</Button></Link>}
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
