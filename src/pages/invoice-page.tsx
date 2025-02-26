import { useCallback } from "react";
import { PaginatedInvoice } from "../components/paginated-invoice";
import { useRootState } from "../hooks/use-root-state";
import { useGetDeductions } from "../hooks/use-get-deductions";
import { HStack, Spinner, VStack } from "@chakra-ui/react";
import { useFormik } from "formik";
import {
  PaginationItems,
  PaginationPrevTrigger,
  PaginationNextTrigger,
  PaginationRoot,
} from "../components/ui/pagination";

export default function InvoicePage() {
  // Get deductions from the services
  useGetDeductions({
    onSuccess: (data) => {
      setDeductions(data);
    },
  });

  // Root state management
  const { setDeductions, currentPage } = useRootState();

  const formik = useFormik({
    initialValues: currentPage || [],
    enableReinitialize: true,
    onSubmit: () => {},
  });

  const handleFieldChange = useCallback((field: string, value: number) => {
    // setDeductions((old) => {
    //   if (!old) return old;
    //   return old.map((deduction) => {
    //     if (deduction.employee.id === field) {
    //       return {
    //         ...deduction,
    //         amount: {
    //           ...deduction.amount,
    //           value,
    //         },
    //       };
    //     }
    //     return deduction;
    //   });
    // });
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
    <VStack gap={4} width="full">
      <PaginatedInvoice
        deductions={formik.values}
        onFieldChange={handleFieldChange}
      />
      <PaginationRoot count={20} pageSize={2} defaultPage={1}>
        <HStack>
          <PaginationPrevTrigger />
          <PaginationItems />
          <PaginationNextTrigger />
        </HStack>
      </PaginationRoot>
    </VStack>
  ) : (
    <Spinner />
  );
}
