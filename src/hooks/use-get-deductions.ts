import { useEffect, useState } from "react";
import { getDeductions } from "../services";
import { GetDeductedAmountPerEmployeeResponse } from "../services/types";
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
      paidAmount: item.paid_amount || 0,
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

type UseGetDeductionParams = {
  onSuccess?: (data: InvoiceDeductionState[]) => void;
};

export const useGetDeductions = ({ onSuccess }: UseGetDeductionParams) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    const fetchDeductions = async () => {
      setIsLoading(true);
      const response = await getDeductions();

      setIsLoading(false);
      onSuccess?.(adaptResponseToState(response));
    };

    fetchDeductions();
  }, []);

  return {
    isLoading,
  };
};
