"use client";

import { motion } from "framer-motion";
import { Zap, ArrowRight, Shield, Wallet, FileText } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";

const features = [
  {
    icon: Wallet,
    title: "Embedded Wallets",
    description: "Each employee gets a dedicated Circle wallet. Funds are isolated and secure.",
  },
  {
    icon: Shield,
    title: "Pre-Funded Payroll",
    description: "Salaries are distributed before claim. No dependency on employer at redemption.",
  },
  {
    icon: FileText,
    title: "Interactive Vouchers",
    description: "PDF salary slips act as claim interfaces. Scan QR or click to redeem instantly.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <header className="border-b border-glass-border bg-bg-primary/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              Pay<span className="gradient-text">Flow</span>
            </span>
          </Link>
          <Link href="/dashboard">
            <Button variant="primary" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
              Launch App
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 relative overflow-hidden">
        {/* Background glow orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent-blue/10 rounded-full blur-[128px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent-purple/10 rounded-full blur-[128px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="text-center max-w-3xl mx-auto relative z-10 pt-20 pb-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-blue/10 text-accent-blue text-sm font-medium mb-8 border border-accent-blue/20"
          >
            <Zap className="w-3.5 h-3.5" />
            Programmable Payroll on Circle
          </motion.div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            Salary slips that{" "}
            <span className="gradient-text">move money</span>
          </h1>

          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            Pre-fund embedded wallets on payout day. Employees claim their salary
            to any wallet instantly via interactive PDF vouchers.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                Open Dashboard
              </Button>
            </Link>
            <Link href="/redeem/demo">
              <Button variant="secondary" size="lg">
                Try Redeem Demo
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto w-full py-20 relative z-10"
        >
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
              className="glass-card glass-card-hover p-6 text-center sm:text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-accent-blue/10 flex items-center justify-center mb-4 mx-auto sm:mx-0">
                <feature.icon className="w-5 h-5 text-accent-blue" />
              </div>
              <h3 className="font-semibold text-base mb-2">{feature.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-glass-border py-6 text-center text-sm text-text-muted">
        <div className="max-w-6xl mx-auto px-6">
          PayFlow — Programmable Payroll System
        </div>
      </footer>
    </div>
  );
}
