import { CheckedState, InvoiceDeductionState } from "../types";
import { useFormik } from "formik";
import { useCallback, useTransition } from "react";

type UseFormParams = {
  initialValues: InvoiceDeductionState[] | undefined;
  onSubmit: (form: InvoiceDeductionState[]) => void;
};

export const useForm = ({ initialValues = [], onSubmit }: UseFormParams) => {
  const [isPending, startTransition] = useTransition();

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit,
  });

  const setFieldValue = useCallback((field: string, value: number) => {
    formik.setValues((old) => {
      if (!old) return old;
      return old.map((deduction) => {
        if (deduction.employee.id === field) {
          return {
            ...deduction,
            remainingAmount: {
              ...deduction.remainingAmount,
              value: deduction.remainingAmount.initialValue! - value,
            },
            amount: {
              ...deduction.amount,
              value,
            },
          };
        }
        return deduction;
      });
    });

    startTransition(() => {
      formik.submitForm();
    });
  }, []);

  const setCheckbox = useCallback((field: string, checked: boolean) => {
    formik.setValues((old) => {
      if (!old) return old;

      return old.map((deduction) => {
        if (deduction.employee.id === field) {
          const {
            outstandingAmount,
            remainingAmount,
            amount,
            suggestWriteoff,
          } = deduction;

          const rolloverAmount = checked ? outstandingAmount : 0;

          return {
            ...deduction,
            remainingAmount: {
              ...remainingAmount,
              value: remainingAmount.initialValue! - rolloverAmount,
            },
            amount: {
              ...amount,
              value: rolloverAmount,
            },
            suggestWriteoff: {
              ...suggestWriteoff,
              value: checked,
            },
          };
        }
        return deduction;
      });
    });

    startTransition(() => {
      formik.submitForm();
    });
  }, []);

  const setAllCheckboxes = useCallback((checked: CheckedState) => {
    formik.setValues((old) => {
      if (!old) return old;

      return old.map((deduction) => {
        const { outstandingAmount, remainingAmount, amount, suggestWriteoff } =
          deduction;

        const rolloverAmount = checked ? outstandingAmount : 0;

        return {
          ...deduction,
          remainingAmount: {
            ...remainingAmount,
            value: remainingAmount.initialValue! - rolloverAmount,
          },
          amount: {
            ...amount,
            value: rolloverAmount,
          },
          suggestWriteoff: {
            ...suggestWriteoff,
            value: Boolean(checked),
          },
        };
      });
    });

    startTransition(() => {
      formik.submitForm();
    });
  }, []);

  return {
    formik,
    setFieldValue,
    setCheckbox,
    setAllCheckboxes,
    isPending,
  };
};
