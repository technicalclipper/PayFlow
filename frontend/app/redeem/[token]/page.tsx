import { getRedeemToken, getRedeemPayrollEmployee } from "@/lib/queries";
import RedeemClient from "./RedeemClient";

export const dynamic = "force-dynamic";

export default async function RedeemPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  // For "demo" token, show demo mode
  if (token === "demo") {
    return (
      <RedeemClient
        token="demo"
        employeeName="Demo User"
        salaryAmount={3000}
        status="funded"
        isExpired={false}
        isUsed={false}
      />
    );
  }

  const tokenData = await getRedeemToken(token);

  if (!tokenData) {
    return (
      <RedeemClient
        token={token}
        employeeName="Unknown"
        salaryAmount={0}
        status="invalid"
        isExpired={false}
        isUsed={false}
        errorMessage="Invalid or expired redeem link."
      />
    );
  }

  const pe = await getRedeemPayrollEmployee(
    tokenData.employee_id,
    tokenData.payroll_id
  );

  return (
    <RedeemClient
      token={token}
      employeeName={tokenData.employees?.name ?? "Unknown"}
      salaryAmount={pe ? Number(pe.salary_amount) : 0}
      status={pe?.status ?? "pending"}
      isExpired={new Date(tokenData.expires_at) < new Date()}
      isUsed={tokenData.is_used}
    />
  );
}
