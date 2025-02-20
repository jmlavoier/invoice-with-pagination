import { HStack, Spinner, Stack, Text, VStack } from "@chakra-ui/react";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "../components/ui/pagination";
import { SearchDeductions } from "../components/search-deductions";
import { useForm } from "../hooks/use-form";
import { RootState } from "../types";
import { DeductionsTable } from "../components/deductions-table";

type InvoiceWithPaginationPageProps = {
  isLoading: boolean;
  rootState: RootState;
};

export function InvoiceWithPaginationPage({
  isLoading,
  rootState,
}: InvoiceWithPaginationPageProps) {
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
  } = rootState;

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
            <VStack gap={4} width="full" backgroundColor="bg.muted" p={4}>
              <Stack flex="1" width="full" alignItems="flex-start">
                <Text fontSize={18}>
                  Invoice Id: 2955534b-1521-468f-844f-cb2a68a790d6
                </Text>
                <Text fontSize={18}>Invoice Number: 1238974</Text>
                <Text
                  fontSize={18}
                >{`Employees: ${formik.values.length}`}</Text>
              </Stack>
              <SearchDeductions
                onChange={(value) => {
                  setSearch(value);
                }}
              />

              <DeductionsTable
                data={formik.values}
                onFieldChange={setFieldValue}
                onCheckboxChange={setCheckbox}
                onCheckAllChange={setAllCheckboxes}
                checkAllValue={checkAllValue}
              />
            </VStack>
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
