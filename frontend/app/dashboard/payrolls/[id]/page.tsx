import { getPayroll } from "@/lib/queries";
import PayrollDetailClient from "./PayrollDetailClient";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PayrollDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const payroll = await getPayroll(id);
    return <PayrollDetailClient payroll={payroll} />;
  } catch {
    notFound();
  }
}
