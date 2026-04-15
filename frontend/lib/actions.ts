"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "./supabase";
import crypto from "crypto";

// ─── Employees ───

export async function createEmployee(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  if (!name || !email) {
    return { error: "Name and email are required" };
  }

  const { data, error } = await supabaseAdmin
    .from("employees")
    .insert({ name, email })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") return { error: "An employee with this email already exists" };
    return { error: error.message };
  }

  revalidatePath("/dashboard/employees");
  revalidatePath("/dashboard");
  return { data };
}

export async function deleteEmployee(id: string) {
  const { error } = await supabaseAdmin
    .from("employees")
    .delete()
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/employees");
  revalidatePath("/dashboard");
  return { success: true };
}

// ─── Payrolls ───

interface CreatePayrollInput {
  payoutDate: string;
  entries: { employeeId: string; amount: number }[];
}

export async function createPayroll(input: CreatePayrollInput) {
  const { payoutDate, entries } = input;

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

// ─── Distribution (simulate funding) ───

export async function distributePayroll(payrollId: string) {
  const { data: payrollEmployees, error: fetchError } = await supabaseAdmin
    .from("payroll_employees")
    .select("id, employee_id, status")
    .eq("payroll_id", payrollId)
    .eq("status", "pending");

  if (fetchError) return { error: fetchError.message };
  if (!payrollEmployees || payrollEmployees.length === 0) {
    return { error: "No pending employees to distribute" };
  }

  const ids = payrollEmployees.map((pe) => pe.id);
  const { error: updateError } = await supabaseAdmin
    .from("payroll_employees")
    .update({ status: "funded" })
    .in("id", ids);

  if (updateError) return { error: updateError.message };

  await supabaseAdmin
    .from("payrolls")
    .update({ status: "processed" })
    .eq("id", payrollId);

  // Generate redeem tokens for each funded employee
  const tokens = payrollEmployees.map((pe) => ({
    token: crypto.randomBytes(32).toString("hex"),
    employee_id: pe.employee_id,
    payroll_id: payrollId,
    is_used: false,
    expires_at: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
  }));

  await supabaseAdmin.from("redeem_tokens").insert(tokens);

  revalidatePath(`/dashboard/payrolls/${payrollId}`);
  revalidatePath("/dashboard/payrolls");
  revalidatePath("/dashboard");
  return { success: true, tokensGenerated: tokens.length };
}

// ─── Generate Redeem Tokens ───

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

  // Step 1: Validate token
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

  // Step 2: Check payroll_employee status
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
    return { error: pe.status === "redeemed" ? "Already redeemed" : "Salary not yet funded" };
  }

  // Step 3: Execute transfer (placeholder — Circle integration goes here later)
  // In production: transfer from embedded wallet → walletAddress via Circle SDK

  // Step 4: Update DB
  const { error: updateTokenError } = await supabaseAdmin
    .from("redeem_tokens")
    .update({ is_used: true })
    .eq("id", tokenData.id);

  if (updateTokenError) return { error: "Failed to update token" };

  const { error: updatePeError } = await supabaseAdmin
    .from("payroll_employees")
    .update({ status: "redeemed" })
    .eq("id", pe.id);

  if (updatePeError) return { error: "Failed to update payroll status" };

  return {
    success: true,
    amount: pe.salary_amount,
    wallet: walletAddress,
  };
}
