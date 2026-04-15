import { getPayrollEmployee } from "@/lib/queries";
import SalarySlipClient from "./SalarySlipClient";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SalarySlipPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const data = await getPayrollEmployee(id);
    return <SalarySlipClient payrollEmployee={data} />;
  } catch {
    notFound();
  }
}
