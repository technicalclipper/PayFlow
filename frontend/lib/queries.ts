import { supabaseAdmin } from "./supabase";
import type { Employee, Payroll, PayrollEmployee, RedeemToken } from "./types";

// ─── Employees ───

export async function getEmployees() {
  const { data, error } = await supabaseAdmin
    .from("employees")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Employee[];
}

export async function getEmployee(id: string) {
  const { data, error } = await supabaseAdmin
    .from("employees")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Employee;
}

// ─── Payrolls ───

export async function getPayrolls() {
  const { data, error } = await supabaseAdmin
    .from("payrolls")
    .select(`
      *,
      payroll_employees (
        *,
        employees (*)
      )
    `)
    .order("payout_date", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getPayroll(id: string) {
  const { data, error } = await supabaseAdmin
    .from("payrolls")
    .select(`
      *,
      payroll_employees (
        *,
        employees (*)
      )
    `)
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

// ─── Dashboard Stats ───

export async function getDashboardStats() {
  const [employeesRes, payrollsRes, payrollEmployeesRes] = await Promise.all([
    supabaseAdmin.from("employees").select("id", { count: "exact", head: true }),
    supabaseAdmin.from("payrolls").select("*"),
    supabaseAdmin.from("payroll_employees").select("status, salary_amount"),
  ]);

  const totalEmployees = employeesRes.count ?? 0;
  const payrolls = (payrollsRes.data ?? []) as Payroll[];
  const payrollEmployees = (payrollEmployeesRes.data ?? []) as Pick<PayrollEmployee, "status" | "salary_amount">[];

  const totalDisbursed = payrollEmployees
    .filter((pe) => pe.status === "funded" || pe.status === "redeemed")
    .reduce((sum, pe) => sum + Number(pe.salary_amount), 0);

  const activePayrolls = payrolls.filter((p) => p.status === "scheduled").length;

  const redeemed = payrollEmployees.filter((pe) => pe.status === "redeemed").length;
  const funded = payrollEmployees.filter((pe) => pe.status === "funded").length;
  const redemptionRate = funded + redeemed > 0
    ? Math.round((redeemed / (funded + redeemed)) * 100)
    : 0;

  return { totalEmployees, totalDisbursed, activePayrolls, redemptionRate };
}

// ─── Recent Activity ───

export async function getRecentActivity(limit = 5) {
  const { data, error } = await supabaseAdmin
    .from("payroll_employees")
    .select(`
      *,
      employees (*),
      payrolls (*)
    `)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

// ─── Salary Slip ───

export async function getPayrollEmployee(id: string) {
  const { data, error } = await supabaseAdmin
    .from("payroll_employees")
    .select(`
      *,
      employees (*),
      payrolls (*)
    `)
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

// ─── Redeem Token ───

export async function getRedeemToken(token: string) {
  const { data, error } = await supabaseAdmin
    .from("redeem_tokens")
    .select(`
      *,
      employees (*),
      payrolls (*)
    `)
    .eq("token", token)
    .single();

  if (error) return null;
  return data as (RedeemToken & { employees: Employee | null; payrolls: Payroll | null }) | null;
}

export async function getRedeemPayrollEmployee(employeeId: string, payrollId: string) {
  const { data, error } = await supabaseAdmin
    .from("payroll_employees")
    .select("*")
    .eq("employee_id", employeeId)
    .eq("payroll_id", payrollId)
    .single();

  if (error) return null;
  return data as PayrollEmployee;
}
