import { useCallback } from "react";
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
  // Get deductions from the services
  useGetDeductions({
    onSuccess: (data) => {
      setDeductions(data);
    },
  });

  // Root state management
  const {
    currentPage,
    itemsPerPage,
    page,
    totalItems,
    setDeductions,
    setPage,
  } = useRootState();

  const formik = useFormik({
    initialValues: currentPage || [],
    enableReinitialize: true,
    onSubmit: () => {},
  });

  const handleFieldChange = useCallback((field: string, value: number) => {
    formik.setValues((old) => {
      if (!old) return old;
      return old.map((deduction) => {
        if (deduction.employee.id === field) {
          return {
            ...deduction,
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

  return formik.values ? (
    <VStack gap={2} paddingY={8} paddingX={12} alignItems="flex-start">
      <Stack alignItems="center" gap={6}>
        <InvoiceDetails
          deductions={formik.values}
          onFieldChange={handleFieldChange}
          renderToolbar={() => (
            <SearchDeductions
              onChange={(value) => console.log("changed", value)}
            />
          )}
        />

        <PaginationRoot
          count={totalItems}
          pageSize={itemsPerPage}
          defaultPage={page}
          onPageChange={(e) => setPage(e.page)}
        >
          <HStack>
            <PaginationPrevTrigger />
            <PaginationItems />
            <PaginationNextTrigger />
          </HStack>
        </PaginationRoot>
      </Stack>
    </VStack>
  ) : (
    <Spinner />
  );
}
