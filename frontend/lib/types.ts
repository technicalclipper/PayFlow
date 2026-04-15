export interface Database {
  public: {
    Tables: {
      employees: {
        Row: Employee;
        Insert: EmployeeInsert;
        Update: EmployeeUpdate;
        Relationships: [];
      };
      payrolls: {
        Row: Payroll;
        Insert: PayrollInsert;
        Update: PayrollUpdate;
        Relationships: [];
      };
      payroll_employees: {
        Row: PayrollEmployee;
        Insert: PayrollEmployeeInsert;
        Update: PayrollEmployeeUpdate;
        Relationships: [
          {
            foreignKeyName: "payroll_employees_payroll_id_fkey";
            columns: ["payroll_id"];
            isOneToOne: false;
            referencedRelation: "payrolls";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payroll_employees_employee_id_fkey";
            columns: ["employee_id"];
            isOneToOne: false;
            referencedRelation: "employees";
            referencedColumns: ["id"];
          },
        ];
      };
      redeem_tokens: {
        Row: RedeemToken;
        Insert: RedeemTokenInsert;
        Update: RedeemTokenUpdate;
        Relationships: [
          {
            foreignKeyName: "redeem_tokens_employee_id_fkey";
            columns: ["employee_id"];
            isOneToOne: false;
            referencedRelation: "employees";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "redeem_tokens_payroll_id_fkey";
            columns: ["payroll_id"];
            isOneToOne: false;
            referencedRelation: "payrolls";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

// ─── Employees ───

export interface Employee {
  id: string;
  name: string;
  email: string;
  wallet_id: string | null;
  wallet_address: string | null;
  created_at: string;
}

export interface EmployeeInsert {
  id?: string;
  name: string;
  email: string;
  wallet_id?: string | null;
  wallet_address?: string | null;
}

export interface EmployeeUpdate {
  name?: string;
  email?: string;
  wallet_id?: string | null;
  wallet_address?: string | null;
}

// ─── Payrolls ───

export interface Payroll {
  id: string;
  payout_date: string;
  total_amount: number;
  status: "scheduled" | "funded" | "processed";
  onchain_payroll_id: number | null;
  onchain_tx_hash: string | null;
  onchain_funded: boolean;
  created_at: string;
}

export interface PayrollInsert {
  id?: string;
  payout_date: string;
  total_amount?: number;
  status?: "scheduled" | "funded" | "processed";
  onchain_payroll_id?: number | null;
  onchain_tx_hash?: string | null;
  onchain_funded?: boolean;
}

export interface PayrollUpdate {
  payout_date?: string;
  total_amount?: number;
  status?: "scheduled" | "funded" | "processed";
  onchain_payroll_id?: number | null;
  onchain_tx_hash?: string | null;
  onchain_funded?: boolean;
}

// ─── Payroll Employees ───

export interface PayrollEmployee {
  id: string;
  payroll_id: string;
  employee_id: string;
  salary_amount: number;
  status: "pending" | "funded" | "redeemed";
  created_at: string;
}

export interface PayrollEmployeeInsert {
  id?: string;
  payroll_id: string;
  employee_id: string;
  salary_amount: number;
  status?: "pending" | "funded" | "redeemed";
}

export interface PayrollEmployeeUpdate {
  salary_amount?: number;
  status?: "pending" | "funded" | "redeemed";
}

// ─── Redeem Tokens ───

export interface RedeemToken {
  id: string;
  token: string;
  employee_id: string;
  payroll_id: string;
  is_used: boolean;
  expires_at: string;
  created_at: string;
}

export interface RedeemTokenInsert {
  id?: string;
  token: string;
  employee_id: string;
  payroll_id: string;
  is_used?: boolean;
  expires_at: string;
}

export interface RedeemTokenUpdate {
  is_used?: boolean;
}

// ─── Joined types for frontend use ───

export interface PayrollWithEmployees extends Payroll {
  payroll_employees: (PayrollEmployee & {
    employees: Employee;
  })[];
}

export interface RedeemTokenWithDetails extends RedeemToken {
  employees: Employee;
  payrolls: Payroll;
  payroll_employees: PayrollEmployee[];
}
