// Server-side contract utilities (kept for future use — e.g., cron jobs, automated distribution)
// Client-side contract interactions are in lib/client-contract.ts

import { ethers } from "ethers";

export const ARC_RPC_URL = process.env.NEXT_PUBLIC_ARC_RPC_URL || "https://rpc.testnet.arc.network";
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";

export const PAYFLOW_ABI = [
  "function payrolls(uint256) external view returns (address employer, uint256 totalAmount, uint256 payoutDate, uint256 employeeCount, bool isFunded, bool isDistributed)",
  "function getPayments(uint256 payrollId) external view returns (tuple(address wallet, uint256 amount, bool isPaid)[])",
  "function getPayrollCount() external view returns (uint256)",
] as const;

export function getProvider() {
  return new ethers.JsonRpcProvider(ARC_RPC_URL);
}

export function getReadContract() {
  return new ethers.Contract(CONTRACT_ADDRESS, PAYFLOW_ABI, getProvider());
}

export function weiToUsdc(wei: bigint): number {
  return Number(ethers.formatEther(wei));
}

export async function getOnchainPayroll(payrollId: number) {
  const contract = getReadContract();
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
