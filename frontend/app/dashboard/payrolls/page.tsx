import { getPayrolls } from "@/lib/queries";
import PayrollsClient from "./PayrollsClient";

export const dynamic = "force-dynamic";

export default async function PayrollsPage() {
  const payrolls = await getPayrolls();
  return <PayrollsClient payrolls={payrolls} />;
}
