import { useEffect, useState } from "react";
import { getDeductions } from "./get-deductions";
import { GetDeductedAmountPerEmployeeResponse } from "./types";
import { InvoiceDeductionState } from "../types";

const adaptResponseToState = (
  response: GetDeductedAmountPerEmployeeResponse
): InvoiceDeductionState[] => {
  return response.data.items.map((item, i) => {
    return {
      employee: {
        id: item.employee.id,
        name: item.employee.name,
        email: item.employee.email,
        hrEmployeeCode: item.employee.hr_employee_code,
      },
      paidAmount: 0,
      suggestWriteoff: {
        isFilled: false,
        isValid: true,
        value: false,
        initialValue: false,
      },
      index: i,
      originalAmount: item.original_amount,
      adjustmentAmount: item.adjustment_amount,
      outstandingAmount: item.outstanding_amount || 0,
      amount: {
        isFilled: false,
        isValid: true,
        value: 0,
        initialValue: 0,
      },
      remainingAmount: {
        isFilled: false,
        isValid: true,
        value: item.original_amount - item.adjustment_amount,
        initialValue: item.original_amount - item.adjustment_amount,
      },
      user: {
        id: item.user.id,
      },
    };
  });
};

export const useDeductions = () => {
  const [deductions, setDeductions] = useState<
    InvoiceDeductionState[] | undefined
  >();

  useEffect(() => {
    const fetchDeductions = async () => {
      const response = await getDeductions();

      console.log(response);

      setDeductions(adaptResponseToState(response));
    };

    fetchDeductions();
  }, []);

  return deductions;
};
