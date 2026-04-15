"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "./supabase";
import crypto from "crypto";

// ─── Employees ───

export async function createEmployee(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const walletAddress = formData.get("wallet_address") as string | null;

  if (!name || !email) {
    return { error: "Name and email are required" };
  }

  const { data, error } = await supabaseAdmin
    .from("employees")
    .insert({ name, email, wallet_address: walletAddress || null })
    .select()
    .single();

  if (error) {
    if (error.code === "23505")
      return { error: "An employee with this email already exists" };
    return { error: error.message };
  }

  revalidatePath("/dashboard/employees");
  revalidatePath("/dashboard");
  return { data };
}

export async function deleteEmployee(id: string) {
  const { error } = await supabaseAdmin.from("employees").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/dashboard/employees");
  revalidatePath("/dashboard");
  return { success: true };
}

// ─── Payrolls (Supabase only — on-chain happens client-side) ───

interface SavePayrollInput {
  payoutDate: string;
  entries: { employeeId: string; amount: number }[];
  onchainPayrollId: number | null;
  onchainTxHash: string | null;
}

export async function savePayroll(input: SavePayrollInput) {
  const { payoutDate, entries, onchainPayrollId, onchainTxHash } = input;

  if (!payoutDate || entries.length === 0) {
    return { error: "Payout date and at least one employee are required" };
  }

  const validEntries = entries.filter((e) => e.employeeId && e.amount > 0);
  if (validEntries.length === 0) {
    return { error: "At least one valid employee assignment is required" };
  }

  const totalAmount = validEntries.reduce((sum, e) => sum + e.amount, 0);

  const { data: payroll, error: payrollError } = await supabaseAdmin
    .from("payrolls")
    .insert({
      payout_date: payoutDate,
      total_amount: totalAmount,
      status: "scheduled",
      onchain_payroll_id: onchainPayrollId,
      onchain_tx_hash: onchainTxHash,
      onchain_funded: false,
    })
    .select()
    .single();

  if (payrollError) return { error: payrollError.message };

  const payrollEmployees = validEntries.map((e) => ({
    payroll_id: payroll.id,
    employee_id: e.employeeId,
    salary_amount: e.amount,
    status: "pending" as const,
  }));

  const { error: peError } = await supabaseAdmin
    .from("payroll_employees")
    .insert(payrollEmployees);

  if (peError) {
    await supabaseAdmin.from("payrolls").delete().eq("id", payroll.id);
    return { error: peError.message };
  }

  revalidatePath("/dashboard/payrolls");
  revalidatePath("/dashboard");
  return { data: payroll };
}

// ─── Mark Funded (called after client-side on-chain funding) ───

export async function markPayrollFunded(payrollId: string, txHash: string) {
  const { error } = await supabaseAdmin
    .from("payrolls")
    .update({ onchain_funded: true, status: "funded" })
    .eq("id", payrollId);

  if (error) return { error: error.message };

  revalidatePath(`/dashboard/payrolls/${payrollId}`);
  revalidatePath("/dashboard/payrolls");
  revalidatePath("/dashboard");
  return { success: true };
}

// ─── Distribute (called after client-side on-chain distribution) ───

export async function markPayrollDistributed(payrollId: string, txHash: string) {
  // Update all pending employees to "funded" status
  const { data: payrollEmployees } = await supabaseAdmin
    .from("payroll_employees")
    .select("id, employee_id, status")
    .eq("payroll_id", payrollId)
    .in("status", ["pending", "funded"]);

  if (payrollEmployees && payrollEmployees.length > 0) {
    const ids = payrollEmployees.map((pe) => pe.id);
    await supabaseAdmin
      .from("payroll_employees")
      .update({ status: "funded" })
      .in("id", ids);
  }

  // Update payroll status
  await supabaseAdmin
    .from("payrolls")
    .update({ status: "processed" })
    .eq("id", payrollId);

  // Generate redeem tokens
  const { data: allPe } = await supabaseAdmin
    .from("payroll_employees")
    .select("id, employee_id")
    .eq("payroll_id", payrollId);

  let tokensGenerated = 0;

  if (allPe && allPe.length > 0) {
    const { data: existingTokens } = await supabaseAdmin
      .from("redeem_tokens")
      .select("employee_id")
      .eq("payroll_id", payrollId);

    const existingEmployeeIds = new Set(
      existingTokens?.map((t: any) => t.employee_id) ?? []
    );

    const newTokens = allPe
      .filter((pe) => !existingEmployeeIds.has(pe.employee_id))
      .map((pe) => ({
        token: crypto.randomBytes(32).toString("hex"),
        employee_id: pe.employee_id,
        payroll_id: payrollId,
        is_used: false,
        expires_at: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
      }));

    if (newTokens.length > 0) {
      await supabaseAdmin.from("redeem_tokens").insert(newTokens);
      tokensGenerated = newTokens.length;
    }
  }

  revalidatePath(`/dashboard/payrolls/${payrollId}`);
  revalidatePath("/dashboard/payrolls");
  revalidatePath("/dashboard");
  return { success: true, tokensGenerated, txHash };
}

// ─── Get Payroll Tokens ───

export async function getPayrollTokens(payrollId: string) {
  const { data, error } = await supabaseAdmin
    .from("redeem_tokens")
    .select(`*, employees (name, email)`)
    .eq("payroll_id", payrollId);

  if (error) return { error: error.message };
  return { data };
}

// ─── Redeem / Claim ───

export async function claimSalary(token: string, walletAddress: string) {
  if (!token || !walletAddress) {
    return { error: "Token and wallet address are required" };
  }

  if (walletAddress.length < 10) {
    return { error: "Invalid wallet address" };
  }

  const { data: tokenData, error: tokenError } = await supabaseAdmin
    .from("redeem_tokens")
    .select("*")
    .eq("token", token)
    .single();

  if (tokenError || !tokenData) {
    return { error: "Invalid or expired token" };
  }

  if (tokenData.is_used) {
    return { error: "This token has already been used" };
  }

  if (new Date(tokenData.expires_at) < new Date()) {
    return { error: "This token has expired" };
  }

  const { data: pe, error: peError } = await supabaseAdmin
    .from("payroll_employees")
    .select("*")
    .eq("employee_id", tokenData.employee_id)
    .eq("payroll_id", tokenData.payroll_id)
    .single();

  if (peError || !pe) {
    return { error: "Payroll record not found" };
  }

  if (pe.status !== "funded") {
    return {
      error:
        pe.status === "redeemed"
          ? "Already redeemed"
          : "Salary not yet funded",
    };
  }

  // Funds already distributed on-chain to employee wallets.
  // Mark as redeemed in DB.
  await supabaseAdmin
    .from("redeem_tokens")
    .update({ is_used: true })
    .eq("id", tokenData.id);

  await supabaseAdmin
    .from("payroll_employees")
    .update({ status: "redeemed" })
    .eq("id", pe.id);

  revalidatePath("/dashboard");
  return {
    success: true,
    amount: pe.salary_amount,
    wallet: walletAddress,
  };
}
