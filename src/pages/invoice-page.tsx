import { useTransition } from "react";
import { InvoiceDetails } from "../components/invoice-details";
import { useRootState } from "../hooks/use-root-state";
import { useGetDeductions } from "../hooks/use-get-deductions";

import { HStack, Spinner, Stack, VStack } from "@chakra-ui/react";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "../components/ui/pagination";
import { SearchDeductions } from "../components/search-deductions";
import { useForm } from "../hooks/use-form";

export default function InvoicePage() {
  // Get deductions from the services
  const { isLoading } = useGetDeductions({
    onSuccess: (data) => {
      setDeductions(data);
    },
  });

  // Root state management
  const {
    currentPage,
    itemsPerPage,
    pageIndex,
    totalItems,
    checkAllValue,
    setDeductions,
    setPage,
    setSearch,
  } = useRootState();

  // Local form per current page
  const { formik, setFieldValue, setCheckbox, setAllCheckboxes, isPending } =
    useForm({
      initialValues: currentPage,
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

  return formik.values ? (
    <VStack gap={2} paddingY={8} paddingX={12} alignItems="flex-start">
      <Stack alignItems="center" gap={6}>
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <InvoiceDetails
              deductions={formik.values}
              onFieldChange={setFieldValue}
              onCheckboxChange={setCheckbox}
              onCheckAllChange={setAllCheckboxes}
              checkAllValue={checkAllValue}
              renderToolbar={() => (
                <SearchDeductions
                  onChange={(value) => {
                    setSearch(value);
                  }}
                />
              )}
            />

            <PaginationRoot
              count={totalItems}
              pageSize={itemsPerPage}
              defaultPage={pageIndex + 1}
              onPageChange={(e) => {
                setPage(e.page);
              }}
            >
              <HStack>
                <PaginationPrevTrigger disabled={isPending} />
                <PaginationItems />
                <PaginationNextTrigger disabled={isPending} />
              </HStack>
            </PaginationRoot>
          </>
        )}
      </Stack>
    </VStack>
  ) : (
    <Spinner />
  );
}
