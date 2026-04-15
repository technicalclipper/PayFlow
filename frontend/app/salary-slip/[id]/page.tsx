"use client";

import { use } from "react";
import { motion } from "framer-motion";
import { Zap, Download, ExternalLink, Building2, User, Calendar, Hash } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { mockPayrolls } from "@/lib/mock-data";

export default function SalarySlipPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const payrollEmployee = mockPayrolls.flatMap((p) => p.employees).find((pe) => pe.id === id) ?? mockPayrolls[0].employees[0];
  const redeemToken = `tkn_${payrollEmployee.id}_${Date.now()}`;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent-blue/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent-purple/5 rounded-full blur-[128px] pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }} className="w-full max-w-lg relative z-10">
        <div className="bg-[#0f1420] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
          {/* Header strip */}
          <div className="gradient-bg px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center"><Zap className="w-3.5 h-3.5 text-white" /></div>
              <span className="font-bold text-sm text-white tracking-tight">PayFlow</span>
            </div>
            <span className="text-xs text-white/70 font-medium">SALARY SLIP</span>
          </div>

          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <div className="flex items-center gap-1.5 text-text-muted text-xs mb-1"><Building2 className="w-3 h-3" /> Company</div>
                <p className="text-sm font-medium">Acme Corp</p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-text-muted text-xs mb-1"><User className="w-3 h-3" /> Employee</div>
                <p className="text-sm font-medium">{payrollEmployee.employee.name}</p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-text-muted text-xs mb-1"><Calendar className="w-3 h-3" /> Period</div>
                <p className="text-sm font-medium">April 2026</p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-text-muted text-xs mb-1"><Hash className="w-3 h-3" /> Slip ID</div>
                <p className="text-sm font-medium font-mono">{payrollEmployee.id}</p>
              </div>
            </div>

            <div className="border-t border-dashed border-white/10 my-6" />

            <div className="text-center py-6">
              <p className="text-xs uppercase tracking-widest text-text-muted mb-3">Net Salary</p>
              <div className="text-5xl sm:text-6xl font-bold tracking-tighter">
                <AnimatedCounter end={payrollEmployee.salaryAmount} duration={1.8} />
              </div>
              <p className="text-lg text-text-secondary mt-2 font-medium">USDC</p>
            </div>

            <div className="bg-white/[0.03] rounded-xl p-4 mb-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Base Salary</span>
                <span className="font-medium">{payrollEmployee.salaryAmount.toLocaleString()} USDC</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Deductions</span>
                <span className="font-medium text-text-muted">0 USDC</span>
              </div>
              <div className="border-t border-white/10 pt-2 flex justify-between text-sm font-semibold">
                <span>Total</span>
                <span className="text-accent-blue">{payrollEmployee.salaryAmount.toLocaleString()} USDC</span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="w-28 h-28 bg-white rounded-xl flex items-center justify-center">
                <div className="grid grid-cols-5 gap-0.5 w-20 h-20">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div key={i} className={`rounded-[2px] ${Math.random() > 0.4 ? "bg-black" : "bg-white"}`} />
                  ))}
                </div>
              </div>
              <p className="text-xs text-text-muted">Scan to claim or click below</p>
              <Link href={`/redeem/${redeemToken}`} className="w-full">
                <Button size="lg" className="w-full" icon={<ExternalLink className="w-4 h-4" />}>Claim Salary</Button>
              </Link>
            </div>
          </div>

          <div className="px-6 py-3 border-t border-white/[0.05] flex items-center justify-between text-xs text-text-muted">
            <span>Generated by PayFlow</span>
            <Button variant="ghost" size="sm" icon={<Download className="w-3.5 h-3.5" />}>Download PDF</Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
