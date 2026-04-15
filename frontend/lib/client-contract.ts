"use client";

import { ethers } from "ethers";

export const CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";

export const PAYFLOW_ABI = [
  "function createPayroll(address[] calldata wallets, uint256[] calldata amounts, uint256 payoutDate) external returns (uint256 payrollId)",
  "function fundPayroll(uint256 payrollId) external payable",
  "function distribute(uint256 payrollId) external",
  "function withdrawFunds(uint256 payrollId) external",

  "function payrolls(uint256) external view returns (address employer, uint256 totalAmount, uint256 payoutDate, uint256 employeeCount, bool isFunded, bool isDistributed)",
  "function getPayments(uint256 payrollId) external view returns (tuple(address wallet, uint256 amount, bool isPaid)[])",
  "function getPayrollCount() external view returns (uint256)",
  "function deposits(uint256 payrollId) external view returns (uint256)",
  "function owner() external view returns (address)",

  "event PayrollCreated(uint256 indexed payrollId, address indexed employer, uint256 totalAmount, uint256 payoutDate, uint256 employeeCount)",
  "event PayrollFunded(uint256 indexed payrollId, uint256 amount)",
  "event SalaryPaid(uint256 indexed payrollId, address indexed employee, uint256 amount)",
  "event PayrollDistributed(uint256 indexed payrollId)",
] as const;

function getContract(signer: ethers.Signer) {
  return new ethers.Contract(CONTRACT_ADDRESS, PAYFLOW_ABI, signer);
}

function getReadContract(provider: ethers.BrowserProvider) {
  return new ethers.Contract(CONTRACT_ADDRESS, PAYFLOW_ABI, provider);
}

export function usdcToWei(amount: number): bigint {
  return ethers.parseEther(amount.toString());
}

export function weiToUsdc(wei: bigint): number {
  return Number(ethers.formatEther(wei));
}

// ─── Write Functions (require connected wallet) ───

export async function createPayrollOnchain(
  signer: ethers.Signer,
  wallets: string[],
  amounts: number[],
  payoutDateUnix: number
): Promise<{ payrollId: number; txHash: string }> {
  const contract = getContract(signer);
  const amountsWei = amounts.map((a) => usdcToWei(a));

  const tx = await contract.createPayroll(wallets, amountsWei, payoutDateUnix);
  const receipt = await tx.wait();

  const event = receipt.logs
    .map((log: ethers.Log) => {
      try {
        return contract.interface.parseLog({
          topics: [...log.topics],
          data: log.data,
        });
      } catch {
        return null;
      }
    })
    .find((e: ethers.LogDescription | null) => e?.name === "PayrollCreated");

  const payrollId = event ? Number(event.args.payrollId) : -1;
  return { payrollId, txHash: receipt.hash };
}

export async function fundPayrollOnchain(
  signer: ethers.Signer,
  payrollId: number,
  amount: number
): Promise<{ txHash: string }> {
  const contract = getContract(signer);
  const tx = await contract.fundPayroll(payrollId, {
    value: usdcToWei(amount),
  });
  const receipt = await tx.wait();
  return { txHash: receipt.hash };
}

export async function distributePayrollOnchain(
  signer: ethers.Signer,
  payrollId: number
): Promise<{ txHash: string }> {
  const contract = getContract(signer);
  const tx = await contract.distribute(payrollId);
  const receipt = await tx.wait();
  return { txHash: receipt.hash };
}

// ─── Read Functions (no wallet needed) ───

export async function getOnchainPayrollInfo(
  provider: ethers.BrowserProvider,
  payrollId: number
) {
  const contract = getReadContract(provider);
  const [employer, totalAmount, payoutDate, employeeCount, isFunded, isDistributed] =
    await contract.payrolls(payrollId);

  return {
    employer: employer as string,
    totalAmount: weiToUsdc(totalAmount),
    payoutDate: Number(payoutDate),
    employeeCount: Number(employeeCount),
    isFunded: isFunded as boolean,
    isDistributed: isDistributed as boolean,
  };
}

export async function getOnchainPayments(
  provider: ethers.BrowserProvider,
  payrollId: number
) {
  const contract = getReadContract(provider);
  const payments = await contract.getPayments(payrollId);
  return payments.map(
    (p: { wallet: string; amount: bigint; isPaid: boolean }) => ({
      wallet: p.wallet,
      amount: weiToUsdc(p.amount),
      isPaid: p.isPaid,
    })
  );
}
