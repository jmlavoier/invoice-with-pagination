import { PaginatedInvoice } from "../components/paginated-invoice";
import { useDeductedAmountPerEmployee } from "../hooks/use-deducted-amount-per-employee";

export default function InvoicePage() {
  const deductions = useDeductedAmountPerEmployee();

  return deductions ? <PaginatedInvoice deductions={deductions} /> : null;
}
