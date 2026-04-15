"use client";

import { motion } from "framer-motion";
import { Users, DollarSign, FileText, TrendingUp, Plus, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

interface DashboardClientProps {
  stats: {
    totalEmployees: number;
    totalDisbursed: number;
    activePayrolls: number;
    redemptionRate: number;
  };
  recentActivity: any[];
  payrolls: any[];
}

export default function DashboardClient({ stats, recentActivity, payrolls }: DashboardClientProps) {
  const statCards = [
    { label: "Total Employees", value: stats.totalEmployees, icon: Users, color: "text-accent-blue", bgColor: "bg-accent-blue/10" },
    { label: "Total Disbursed", value: stats.totalDisbursed, prefix: "$", icon: DollarSign, color: "text-success", bgColor: "bg-success/10" },
    { label: "Active Payrolls", value: stats.activePayrolls, icon: FileText, color: "text-accent-purple", bgColor: "bg-accent-purple/10" },
    { label: "Redemption Rate", value: stats.redemptionRate, suffix: "%", icon: TrendingUp, color: "text-warning", bgColor: "bg-warning/10" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <motion.h1 initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-2xl sm:text-3xl font-bold tracking-tight">
            Payroll Dashboard
          </motion.h1>
          <p className="text-text-secondary text-sm mt-1">Manage payrolls, employees, and disbursements</p>
        </div>
        <Link href="/dashboard/payrolls/create">
          <Button icon={<Plus className="w-4 h-4" />}>Create Payroll</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <GlassCard key={stat.label} hoverable className="p-5" transition={{ delay: i * 0.05, duration: 0.4 }}>
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight">
              <AnimatedCounter end={stat.value} prefix={stat.prefix} suffix={stat.suffix} duration={1.5} />
            </div>
            <p className="text-sm text-text-secondary mt-1">{stat.label}</p>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2 p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-glass-border flex items-center justify-between">
            <h2 className="font-semibold text-base">Recent Employee Activity</h2>
            <Link href="/dashboard/employees" className="text-xs text-accent-blue hover:text-accent-blue/80 flex items-center gap-1 transition-colors">
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-glass-border">
                  <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-3">Employee</th>
                  <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-3">Amount</th>
                  <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.length === 0 ? (
                  <tr><td colSpan={3} className="px-6 py-8 text-center text-sm text-text-muted">No activity yet. Create a payroll to get started.</td></tr>
                ) : (
                  recentActivity.map((pe: any, i: number) => (
                    <motion.tr key={pe.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05 }} className="border-b border-glass-border last:border-0 hover:bg-white/[0.02] transition-colors">
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
                      <td className="px-6 py-4"><span className="text-sm font-semibold">{Number(pe.salary_amount).toLocaleString()} USDC</span></td>
                      <td className="px-6 py-4"><Badge status={pe.status} /></td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>

        <GlassCard className="p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-glass-border flex items-center justify-between">
            <h2 className="font-semibold text-base">Payrolls</h2>
            <Link href="/dashboard/payrolls" className="text-xs text-accent-blue hover:text-accent-blue/80 flex items-center gap-1 transition-colors">
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-glass-border">
            {payrolls.length === 0 ? (
              <div className="px-6 py-8 text-center text-sm text-text-muted">No payrolls yet.</div>
            ) : (
              payrolls.slice(0, 5).map((payroll: any, i: number) => (
                <motion.div key={payroll.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }} className="px-6 py-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">{new Date(payroll.payout_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                    <Badge status={payroll.status} />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-text-muted">{payroll.payroll_employees?.length ?? 0} employees</p>
                    <p className="text-sm font-semibold">{Number(payroll.total_amount).toLocaleString()} USDC</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
