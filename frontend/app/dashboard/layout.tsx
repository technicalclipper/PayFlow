"use client";

import Sidebar from "@/components/ui/Sidebar";
import WalletConnect from "@/components/ui/WalletConnect";
import { WalletProvider } from "@/contexts/WalletContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WalletProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="sticky top-0 z-40 border-b border-glass-border bg-bg-primary/80 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 h-14 flex items-center justify-end">
              <WalletConnect />
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">{children}</div>
        </main>
      </div>
    </WalletProvider>
  );
}
