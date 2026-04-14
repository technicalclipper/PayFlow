import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PayFlow — Programmable Payroll",
  description:
    "Turn salary slips into interactive crypto vouchers. Pre-fund embedded wallets, claim to any address.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-bg-primary text-text-primary font-sans">
        {children}
      </body>
    </html>
  );
}
