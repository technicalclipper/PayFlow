export interface Employee {
  id: string;
  name: string;
  email: string;
  walletId: string;
  createdAt: string;
}

export interface PayrollEmployee {
  id: string;
  payrollId: string;
  employee: Employee;
  salaryAmount: number;
  status: "pending" | "funded" | "redeemed";
}

export interface Payroll {
  id: string;
  payoutDate: string;
  totalAmount: number;
  status: "scheduled" | "processed";
  employees: PayrollEmployee[];
}

export const mockEmployees: Employee[] = [
  {
    id: "emp-001",
    name: "Alice Johnson",
    email: "alice@company.io",
    walletId: "circle-wal-0x1a2b",
    createdAt: "2026-01-15",
  },
  {
    id: "emp-002",
    name: "Bob Martinez",
    email: "bob@company.io",
    walletId: "circle-wal-0x3c4d",
    createdAt: "2026-01-15",
  },
  {
    id: "emp-003",
    name: "Carol Chen",
    email: "carol@company.io",
    walletId: "circle-wal-0x5e6f",
    createdAt: "2026-02-01",
  },
  {
    id: "emp-004",
    name: "David Park",
    email: "david@company.io",
    walletId: "circle-wal-0x7a8b",
    createdAt: "2026-02-10",
  },
  {
    id: "emp-005",
    name: "Eva Schmidt",
    email: "eva@company.io",
    walletId: "circle-wal-0x9c0d",
    createdAt: "2026-03-01",
  },
];

export const mockPayrolls: Payroll[] = [
  {
    id: "pay-001",
    payoutDate: "2026-04-01",
    totalAmount: 12500,
    status: "processed",
    employees: [
      {
        id: "pe-001",
        payrollId: "pay-001",
        employee: mockEmployees[0],
        salaryAmount: 3000,
        status: "redeemed",
      },
      {
        id: "pe-002",
        payrollId: "pay-001",
        employee: mockEmployees[1],
        salaryAmount: 2500,
        status: "redeemed",
      },
      {
        id: "pe-003",
        payrollId: "pay-001",
        employee: mockEmployees[2],
        salaryAmount: 3500,
        status: "funded",
      },
      {
        id: "pe-004",
        payrollId: "pay-001",
        employee: mockEmployees[3],
        salaryAmount: 2000,
        status: "funded",
      },
      {
        id: "pe-005",
        payrollId: "pay-001",
        employee: mockEmployees[4],
        salaryAmount: 1500,
        status: "funded",
      },
    ],
  },
  {
    id: "pay-002",
    payoutDate: "2026-05-01",
    totalAmount: 13000,
    status: "scheduled",
    employees: [
      {
        id: "pe-006",
        payrollId: "pay-002",
        employee: mockEmployees[0],
        salaryAmount: 3000,
        status: "pending",
      },
      {
        id: "pe-007",
        payrollId: "pay-002",
        employee: mockEmployees[1],
        salaryAmount: 2500,
        status: "pending",
      },
      {
        id: "pe-008",
        payrollId: "pay-002",
        employee: mockEmployees[2],
        salaryAmount: 3500,
        status: "pending",
      },
      {
        id: "pe-009",
        payrollId: "pay-002",
        employee: mockEmployees[3],
        salaryAmount: 2500,
        status: "pending",
      },
      {
        id: "pe-010",
        payrollId: "pay-002",
        employee: mockEmployees[4],
        salaryAmount: 1500,
        status: "pending",
      },
    ],
  },
];
