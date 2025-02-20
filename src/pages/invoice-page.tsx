import { useCallback, useTransition } from "react";
import { InvoiceDetails } from "../components/invoice-details";
import { useRootState } from "../hooks/use-root-state";
import { useGetDeductions } from "../hooks/use-get-deductions";
import { useFormik } from "formik";

import { HStack, Spinner, Stack, VStack } from "@chakra-ui/react";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "../components/ui/pagination";
import { SearchDeductions } from "../components/search-deductions";

export default function InvoicePage() {
  const [isPending, startTransition] = useTransition();

  // Get deductions from the services
  const { isLoading } = useGetDeductions({
    onSuccess: (data) => {
      console.log("success");
      setDeductions(data);
    },
  });

  // Root state management
  const {
    currentPage,
    itemsPerPage,
    pageIndex,
    totalItems,
    setDeductions,
    setPage,
    setSearch,
  } = useRootState();

  const formik = useFormik({
    initialValues: currentPage || [],
    enableReinitialize: true,
    onSubmit: (form) => {
      setDeductions((old) => {
        let newState = [...old!];

        for (let deduc of form) {
          newState[deduc.index] = { ...deduc };
        }

        return newState;
      });
    },
  });

  const handleFieldChange = useCallback((field: string, value: number) => {
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

  const handleCheckboxChange = useCallback(
    (field: string, checked: boolean) => {
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
    },
    []
  );

  const handleCheckAllChange = useCallback((checked: boolean) => {
    setDeductions((old) => {
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
            value: checked,
          },
        };
      });
    });
  }, []);

  return formik.values ? (
    <VStack gap={2} paddingY={8} paddingX={12} alignItems="flex-start">
      <Stack alignItems="center" gap={6}>
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <InvoiceDetails
              deductions={formik.values}
              onFieldChange={handleFieldChange}
              onCheckboxChange={handleCheckboxChange}
              onCheckAllChange={handleCheckAllChange}
              renderToolbar={() => (
                <SearchDeductions
                  onChange={(value) => {
                    setSearch(value);
                  }}
                />
              )}
            />
            {isPending ? (
              <Spinner />
            ) : (
              <PaginationRoot
                count={totalItems}
                pageSize={itemsPerPage}
                defaultPage={pageIndex + 1}
                onPageChange={async (e) => {
                  setPage(e.page);
                }}
              >
                <HStack>
                  <PaginationPrevTrigger />
                  <PaginationItems />
                  <PaginationNextTrigger />
                </HStack>
              </PaginationRoot>
            )}
          </>
        )}
      </Stack>
    </VStack>
  ) : (
    <Spinner />
  );
}
