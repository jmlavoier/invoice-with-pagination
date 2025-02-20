import { Tabs, VStack } from "@chakra-ui/react";
import { InvoiceWithPaginationPage } from "./invoice-with-pagination-page";
import { useGetDeductions } from "../hooks/use-get-deductions";
import { useRootState } from "../hooks/use-root-state";
import { InvoiceCurrentPage } from "./invoice-current-page";
import { useVirtualizer } from "@tanstack/react-virtual";

export const Pocs = () => {
  // Get deductions from the services
  const { isLoading } = useGetDeductions({
    onSuccess: (data) => {
      rootState.setDeductions(data);
    },
  });

  // Root state management
  const rootState = useRootState();

  return (
    <VStack gap={4}>
      <Tabs.Root defaultValue="current" variant="enclosed">
        <Tabs.List>
          <Tabs.Trigger value="current">Current</Tabs.Trigger>
          <Tabs.Trigger value="pagination">Pagination</Tabs.Trigger>
          <Tabs.Trigger value="virtualization">Virtualization</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="current">
          <InvoiceCurrentPage isLoading={isLoading} rootState={rootState} />
        </Tabs.Content>
        <Tabs.Content value="pagination">
          <InvoiceWithPaginationPage
            isLoading={isLoading}
            rootState={rootState}
          />
        </Tabs.Content>
        <Tabs.Content value="virtualization">
          Manage your tasks for freelancers
        </Tabs.Content>
      </Tabs.Root>
    </VStack>
  );
};
