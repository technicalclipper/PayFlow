"use client";

import { motion } from "framer-motion";
import { UserPlus, Search, Mail, Wallet } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { mockEmployees } from "@/lib/mock-data";
import { useState } from "react";

export default function EmployeesPage() {
  const [search, setSearch] = useState("");

  const filtered = mockEmployees.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl sm:text-3xl font-bold tracking-tight"
          >
            Employees
          </motion.h1>
          <p className="text-text-secondary text-sm mt-1">
            Manage employee records and wallet mappings
          </p>
        </div>
        <Button icon={<UserPlus className="w-4 h-4" />}>Add Employee</Button>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <Input
          placeholder="Search employees..."
          icon={<Search className="w-4 h-4" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Employee Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((employee, i) => (
          <GlassCard
            key={employee.id}
            hoverable
            className="p-5"
            transition={{ delay: i * 0.04, duration: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-full gradient-bg flex items-center justify-center text-sm font-bold text-white">
                {employee.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <p className="font-semibold text-sm">{employee.name}</p>
                <p className="text-xs text-text-muted">{employee.id}</p>
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
                  {employee.walletId}
                </code>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-glass-border">
              <p className="text-xs text-text-muted">
                Added{" "}
                {new Date(employee.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
