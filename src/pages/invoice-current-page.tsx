import { Spinner, Stack, Text, VStack } from "@chakra-ui/react";

import { CheckedState, RootState } from "../types";
import { useCallback, useRef } from "react";
import { DeductionsVirtualTable } from "../components/deductions-virtual-table";
import { SearchDeductions } from "../components/search-deductions";

type InvoiceWithPaginationPageProps = {
  isLoading: boolean;
  rootState: RootState;
};

export function InvoiceCurrentPage({
  isLoading,
  rootState,
}: InvoiceWithPaginationPageProps) {
  const parentRef = useRef<HTMLDivElement | null>(null);

  // Root state management
  const {
    deductions,
    filteredDeductions,
    checkAllValue,
    setDeductions,
    setSearch,
  } = rootState;

  const setFieldValue = useCallback((field: string, value: number) => {
    setDeductions((old) => {
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
  }, []);

  const setCheckbox = useCallback((field: string, checked: boolean) => {
    setDeductions((old) => {
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
  }, []);

  const setAllCheckboxes = useCallback((checked: CheckedState) => {
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
            value: Boolean(checked),
          },
        };
      });
    });
  }, []);

  return filteredDeductions ? (
    <VStack gap={2} paddingY={8} paddingX={12} alignItems="flex-start">
      <Stack ref={parentRef} alignItems="center" gap={6}>
        {isLoading ? (
          <Spinner />
        ) : (
          <VStack gap={4} width="full" backgroundColor="bg.muted" p={4}>
            <Stack flex="1" width="full" alignItems="flex-start">
              <Text fontSize={18}>
                Invoice Id: 2955534b-1521-468f-844f-cb2a68a790d6
              </Text>
              <Text fontSize={18}>Invoice Number: 1238974</Text>
              <Text fontSize={18}>{`Employees: ${deductions.length}`}</Text>
            </Stack>
            <SearchDeductions
              onChange={(value) => {
                setSearch(value);
              }}
            />

            <DeductionsVirtualTable
              data={filteredDeductions}
              onFieldChange={setFieldValue}
              onCheckboxChange={setCheckbox}
              onCheckAllChange={setAllCheckboxes}
              checkAllValue={checkAllValue}
            />
          </VStack>
        )}
      </Stack>
    </VStack>
  ) : (
    <Spinner />
  );
}
