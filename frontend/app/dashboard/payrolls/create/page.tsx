"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Plus, Trash2, Calendar, DollarSign } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { mockEmployees } from "@/lib/mock-data";

interface PayrollEntry {
  employeeId: string;
  amount: string;
}

export default function CreatePayrollPage() {
  const [payoutDate, setPayoutDate] = useState("");
  const [entries, setEntries] = useState<PayrollEntry[]>([
    { employeeId: "", amount: "" },
  ]);

  const addEntry = () => {
    setEntries([...entries, { employeeId: "", amount: "" }]);
  };

  const removeEntry = (index: number) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const updateEntry = (index: number, field: keyof PayrollEntry, value: string) => {
    const updated = [...entries];
    updated[index] = { ...updated[index], [field]: value };
    setEntries(updated);
  };

  const totalAmount = entries.reduce(
    (sum, e) => sum + (parseFloat(e.amount) || 0),
    0
  );

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Back + Header */}
      <div>
        <Link
          href="/dashboard/payrolls"
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Payrolls
        </Link>

        <motion.h1
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl sm:text-3xl font-bold tracking-tight"
        >
          Create Payroll
        </motion.h1>
        <p className="text-text-secondary text-sm mt-1">
          Set up a new payroll cycle and assign salaries
        </p>
      </div>

      {/* Payout Date */}
      <GlassCard className="p-6">
        <h2 className="font-semibold text-base mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-accent-blue" />
          Payout Date
        </h2>
        <Input
          type="date"
          value={payoutDate}
          onChange={(e) => setPayoutDate(e.target.value)}
          className="max-w-xs [color-scheme:dark]"
        />
      </GlassCard>

      {/* Employee Entries */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-base flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-accent-purple" />
            Salary Assignments
          </h2>
          <Button
            variant="secondary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={addEntry}
          >
            Add Employee
          </Button>
        </div>

        <div className="space-y-4">
          {entries.map((entry, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex flex-col sm:flex-row gap-3 items-start sm:items-end"
            >
              <div className="flex-1 w-full">
                <label className="block text-xs font-medium text-text-secondary mb-1.5">
                  Employee
                </label>
                <select
                  value={entry.employeeId}
                  onChange={(e) => updateEntry(i, "employeeId", e.target.value)}
                  className="w-full bg-white/[0.03] border border-glass-border rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/30 transition-all duration-200 appearance-none"
                >
                  <option value="" className="bg-bg-secondary">
                    Select employee...
                  </option>
                  {mockEmployees.map((emp) => (
                    <option key={emp.id} value={emp.id} className="bg-bg-secondary">
                      {emp.name} — {emp.email}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full sm:w-48">
                <Input
                  label="Amount (USDC)"
                  type="number"
                  placeholder="0.00"
                  value={entry.amount}
                  onChange={(e) => updateEntry(i, "amount", e.target.value)}
                />
              </div>
              {entries.length > 1 && (
                <button
                  onClick={() => removeEntry(i)}
                  className="p-3 text-text-muted hover:text-error transition-colors rounded-xl hover:bg-error/10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Summary & Submit */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-text-secondary">Total Payroll Amount</p>
            <p className="text-3xl font-bold mt-1">
              {totalAmount.toLocaleString()}{" "}
              <span className="text-sm font-normal text-text-muted">USDC</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-text-secondary">Employees</p>
            <p className="text-3xl font-bold mt-1">
              {entries.filter((e) => e.employeeId).length}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button size="lg" className="flex-1">
            Create Payroll
          </Button>
          <Link href="/dashboard/payrolls">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              Cancel
            </Button>
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
