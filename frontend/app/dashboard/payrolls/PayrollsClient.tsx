"use client";

import { motion } from "framer-motion";
import { Plus, Calendar, DollarSign, Users, Eye } from "lucide-react";
import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

export default function PayrollsClient({ payrolls }: { payrolls: any[] }) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <motion.h1 initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-2xl sm:text-3xl font-bold tracking-tight">Payrolls</motion.h1>
          <p className="text-text-secondary text-sm mt-1">Create and manage payroll cycles</p>
        </div>
        <Link href="/dashboard/payrolls/create">
          <Button icon={<Plus className="w-4 h-4" />}>Create Payroll</Button>
        </Link>
      </div>

      {payrolls.length === 0 ? (
        <div className="text-center py-16 text-text-muted text-sm">No payrolls yet. Create your first payroll.</div>
      ) : (
        <div className="space-y-4">
          {payrolls.map((payroll: any, i: number) => {
            const employees = payroll.payroll_employees ?? [];
            return (
              <GlassCard key={payroll.id} hoverable className="p-6" transition={{ delay: i * 0.05, duration: 0.4 }}>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold">
                        Payroll — {new Date(payroll.payout_date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                      </h3>
                      <Badge status={payroll.status} />
                    </div>
                    <div className="flex flex-wrap items-center gap-6 text-sm text-text-secondary">
                      <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-text-muted" />{new Date(payroll.payout_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                      <div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-text-muted" /><span className="font-medium text-text-primary">{Number(payroll.total_amount).toLocaleString()} USDC</span></div>
                      <div className="flex items-center gap-2"><Users className="w-4 h-4 text-text-muted" />{employees.length} employees</div>
                    </div>
                  </div>
                  <Link href={`/dashboard/payrolls/${payroll.id}`}>
                    <Button variant="secondary" size="sm" icon={<Eye className="w-4 h-4" />}>View Details</Button>
                  </Link>
                </div>
                <div className="mt-4 pt-4 border-t border-glass-border">
                  <div className="flex flex-wrap gap-4 text-xs">
                    {(["pending", "funded", "redeemed"] as const).map((status) => {
                      const count = employees.filter((e: any) => e.status === status).length;
                      if (count === 0) return null;
                      return <div key={status} className="flex items-center gap-2"><Badge status={status} /><span className="text-text-muted">× {count}</span></div>;
                    })}
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
