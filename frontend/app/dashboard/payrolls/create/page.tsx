import { getEmployees } from "@/lib/queries";
import CreatePayrollClient from "./CreatePayrollClient";

export const dynamic = "force-dynamic";

export default async function CreatePayrollPage() {
  const employees = await getEmployees();
  return <CreatePayrollClient employees={employees} />;
}
