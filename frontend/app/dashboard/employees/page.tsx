import { getEmployees } from "@/lib/queries";
import EmployeesClient from "./EmployeesClient";

export const dynamic = "force-dynamic";

export default async function EmployeesPage() {
  const employees = await getEmployees();
  return <EmployeesClient employees={employees} />;
}
