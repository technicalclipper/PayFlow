"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Plus, Trash2, Calendar, DollarSign } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { createPayroll } from "@/lib/actions";
import type { Employee } from "@/lib/types";

interface PayrollEntry { employeeId: string; amount: string; }

export default function CreatePayrollClient({ employees }: { employees: Employee[] }) {
  const [payoutDate, setPayoutDate] = useState("");
  const [entries, setEntries] = useState<PayrollEntry[]>([{ employeeId: "", amount: "" }]);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const addEntry = () => setEntries([...entries, { employeeId: "", amount: "" }]);
  const removeEntry = (index: number) => setEntries(entries.filter((_, i) => i !== index));
  const updateEntry = (index: number, field: keyof PayrollEntry, value: string) => {
    const updated = [...entries];
    updated[index] = { ...updated[index], [field]: value };
    setEntries(updated);
  };

  const totalAmount = entries.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

  const handleSubmit = () => {
    setError("");
    startTransition(async () => {
      const result = await createPayroll({
        payoutDate,
        entries: entries
          .filter((e) => e.employeeId && parseFloat(e.amount) > 0)
          .map((e) => ({ employeeId: e.employeeId, amount: parseFloat(e.amount) })),
      });
      if (result.error) {
        setError(result.error);
      } else {
        router.push("/dashboard/payrolls");
      }
    });
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <Link href="/dashboard/payrolls" className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Payrolls
        </Link>
        <motion.h1 initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-2xl sm:text-3xl font-bold tracking-tight">Create Payroll</motion.h1>
        <p className="text-text-secondary text-sm mt-1">Set up a new payroll cycle and assign salaries</p>
      </div>

      {employees.length === 0 && (
        <GlassCard className="p-5 text-center">
          <p className="text-sm text-text-secondary mb-3">You need to add employees first before creating a payroll.</p>
          <Link href="/dashboard/employees"><Button variant="secondary" size="sm">Go to Employees</Button></Link>
        </GlassCard>
      )}

      <GlassCard className="p-6">
        <h2 className="font-semibold text-base mb-4 flex items-center gap-2"><Calendar className="w-4 h-4 text-accent-blue" /> Payout Date</h2>
        <Input type="date" value={payoutDate} onChange={(e) => setPayoutDate(e.target.value)} className="max-w-xs [color-scheme:dark]" />
      </GlassCard>

      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-base flex items-center gap-2"><DollarSign className="w-4 h-4 text-accent-purple" /> Salary Assignments</h2>
          <Button variant="secondary" size="sm" icon={<Plus className="w-4 h-4" />} onClick={addEntry}>Add Employee</Button>
        </div>
        <div className="space-y-4">
          {entries.map((entry, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
              <div className="flex-1 w-full">
                <label className="block text-xs font-medium text-text-secondary mb-1.5">Employee</label>
                <select value={entry.employeeId} onChange={(e) => updateEntry(i, "employeeId", e.target.value)} className="w-full bg-white/[0.03] border border-glass-border rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/30 transition-all duration-200 appearance-none">
                  <option value="" className="bg-bg-secondary">Select employee...</option>
                  {employees.map((emp) => (<option key={emp.id} value={emp.id} className="bg-bg-secondary">{emp.name} — {emp.email}</option>))}
                </select>
              </div>
              <div className="w-full sm:w-48">
                <Input label="Amount (USDC)" type="number" placeholder="0.00" value={entry.amount} onChange={(e) => updateEntry(i, "amount", e.target.value)} />
              </div>
              {entries.length > 1 && (
                <button onClick={() => removeEntry(i)} className="p-3 text-text-muted hover:text-error transition-colors rounded-xl hover:bg-error/10"><Trash2 className="w-4 h-4" /></button>
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
            <p className="text-3xl font-bold mt-1">{entries.filter((e) => e.employeeId).length}</p>
          </div>
        </div>
        {error && <p className="text-sm text-error mb-4">{error}</p>}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button size="lg" className="flex-1" onClick={handleSubmit} loading={isPending} disabled={!payoutDate || entries.every((e) => !e.employeeId)}>
            Create Payroll
          </Button>
          <Link href="/dashboard/payrolls"><Button variant="secondary" size="lg" className="w-full sm:w-auto">Cancel</Button></Link>
        </div>
      </GlassCard>
    </div>
  );
}
