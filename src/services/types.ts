export type InvoiceDeductionEmployee = {
  id: string;
  name: string;
  email: string;
  hr_employee_code: string;
};

export type InvoiceDeduction = {
  employee: InvoiceDeductionEmployee;
  user: {
    id: string;
  };
  outstanding_amount?: number;
  original_amount: number;
  paid_amount?: number;
  adjustment_amount: number;
  details?: {
    reason: string;
    description: string;
  };
};

export type GetDeductedAmountPerEmployeeResponse = {
  code: number;
  data: {
    page: number;
    total_pages: number;
    total_items: number;
    items: InvoiceDeduction[];
  };
};
