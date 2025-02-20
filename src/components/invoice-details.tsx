import { Skeleton, Spinner, Stack, Text, VStack } from "@chakra-ui/react";
import { InvoiceDeductionState } from "../types";
import { DeductionsTable } from "./deductions-table";
import { ReactNode, Suspense } from "react";

type PaginatedInvoiceProps = {
  deductions: InvoiceDeductionState[];
  onFieldChange?: (field: string, value: number) => void;
  onCheckboxChange?: (field: string, value: boolean) => void;
  onCheckAllChange?: (value: boolean) => void;
  renderToolbar?: () => ReactNode;
};

export const InvoiceDetails = ({
  deductions,
  onFieldChange,
  renderToolbar,
  onCheckboxChange,
  onCheckAllChange,
}: PaginatedInvoiceProps) => {
  return (
    <VStack gap={4} width="full" backgroundColor="bg.muted" p={4}>
      <Stack flex="1" width="full" alignItems="flex-start">
        <Text fontSize={18}>
          Invoice Id: 2955534b-1521-468f-844f-cb2a68a790d6
        </Text>
        <Text fontSize={18}>Invoice Number: 1238974</Text>
      </Stack>
      {renderToolbar ? <Stack width="full">{renderToolbar()}</Stack> : null}
      <Stack>
        <Suspense fallback={<Spinner />}>
          <DeductionsTable
            data={deductions}
            onFieldChange={onFieldChange}
            onCheckboxChange={onCheckboxChange}
            onCheckAllChange={onCheckAllChange}
          />
        </Suspense>
      </Stack>
    </VStack>
  );
};
