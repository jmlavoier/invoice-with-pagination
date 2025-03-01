type Field<T = string> = {
  initialValue?: T;
  value: T;
  isValid: boolean;
  isFilled: boolean;
  error?: string;
};

export type InvoiceDeductionState = {
  employee: {
    name: string;
    id: string;
    email: string;
    hrEmployeeCode: string;
  };
  user: {
    id: string;
  };
  outstandingAmount: number;
  paidAmount: number;
  adjustmentAmount: number;
  remainingAmount: Field<number>;
  originalAmount: number;
  amount: Field<number>;
  suggestWriteoff: Field<boolean>;
  index: number;
};

export type RootState = {
  page: number;
  itemsPerPage: number;
  totalItems: number;
  currentPage: InvoiceDeductionState[];
  deductions: InvoiceDeductionState[];
  setDeductions: React.Dispatch<
    React.SetStateAction<InvoiceDeductionState[] | undefined>
  >;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};
