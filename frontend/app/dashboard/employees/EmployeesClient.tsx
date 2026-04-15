"use client";

import { motion } from "framer-motion";
import { UserPlus, Search, Mail, Wallet, X } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import type { Employee } from "@/lib/types";
import { createEmployee } from "@/lib/actions";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function EmployeesClient({ employees }: { employees: Employee[] }) {
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const filtered = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (formData: FormData) => {
    setError("");
    startTransition(async () => {
      const result = await createEmployee(formData);
      if (result.error) {
        setError(result.error);
      } else {
        setShowAdd(false);
        router.refresh();
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <motion.h1 initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-2xl sm:text-3xl font-bold tracking-tight">Employees</motion.h1>
          <p className="text-text-secondary text-sm mt-1">Manage employee records and wallet mappings</p>
        </div>
        <Button icon={<UserPlus className="w-4 h-4" />} onClick={() => setShowAdd(true)}>Add Employee</Button>
      </div>

      {/* Add Employee Modal */}
      {showAdd && (
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-base">Add Employee</h2>
            <button onClick={() => { setShowAdd(false); setError(""); }} className="text-text-muted hover:text-text-primary transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form action={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1"><Input name="name" placeholder="Full name" required /></div>
            <div className="flex-1"><Input name="email" type="email" placeholder="Email address" required /></div>
            <Button type="submit" loading={isPending}>Add</Button>
          </form>
          {error && <p className="text-sm text-error mt-2">{error}</p>}
        </GlassCard>
      )}

      <div className="max-w-md">
        <Input placeholder="Search employees..." icon={<Search className="w-4 h-4" />} value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-text-muted text-sm">
          {employees.length === 0 ? "No employees yet. Add your first employee above." : "No employees match your search."}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((employee, i) => (
            <GlassCard key={employee.id} hoverable className="p-5" transition={{ delay: i * 0.04, duration: 0.4 }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full gradient-bg flex items-center justify-center text-sm font-bold text-white">
                  {employee.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="font-semibold text-sm">{employee.name}</p>
                  <p className="text-xs text-text-muted truncate max-w-[140px]">{employee.id.slice(0, 8)}...</p>
                </div>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 text-sm text-text-secondary">
                  <Mail className="w-4 h-4 text-text-muted flex-shrink-0" />
                  <span className="truncate">{employee.email}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-text-secondary">
                  <Wallet className="w-4 h-4 text-text-muted flex-shrink-0" />
                  <code className="text-xs bg-white/5 px-2 py-0.5 rounded truncate">
                    {employee.wallet_id ?? "No wallet yet"}
                  </code>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-glass-border">
                <p className="text-xs text-text-muted">
                  Added {new Date(employee.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
