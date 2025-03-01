import { Skeleton, Stack, VStack } from "@chakra-ui/react";
import { InvoiceDeductionState } from "../types";
import { DeductionsTable } from "./deductions-table";

type PaginatedInvoiceProps = {
  deductions: InvoiceDeductionState[];
  onFieldChange?: (field: string, value: number) => void;
};

export const PaginatedInvoice = ({
  deductions,
  onFieldChange,
}: PaginatedInvoiceProps) => {
  return (
    <VStack gap={4}>
      <Stack flex="1" backgroundColor="CaptionText">
        <Skeleton height="5" />
        <Skeleton height="5" width="80%" />
      </Stack>
      <Stack>
        <DeductionsTable data={deductions} onFieldChange={onFieldChange} />
      </Stack>
    </VStack>
  );
};
