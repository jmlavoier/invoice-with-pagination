import {
  Input,
  Table,
  Text,
  Checkbox as ChakraCheckbox,
  Flex,
  Box,
} from "@chakra-ui/react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  RowData,
} from "@tanstack/react-table";
import { currency } from "../helpers";
import { InvoiceDeductionState } from "../types";
import { Checkbox } from "./ui/checkbox";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

type CheckedState = ChakraCheckbox.RootProps["checked"];

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (field: string, value: number) => void;
    onCheckboxChange?: (field: string, value: boolean) => void;
    onCheckAllChange?: (value: CheckedState) => void;
    checkAllValue?: CheckedState;
  }
}

const columnHelper = createColumnHelper<InvoiceDeductionState>();

const columns = [
  columnHelper.accessor((deduction) => deduction, {
    id: "suggest-writeoff",
    header: (info) => {
      const { onCheckAllChange, checkAllValue } = info.table.options.meta!;

      return (
        <Checkbox
          checked={checkAllValue}
          onCheckedChange={({ checked }) => {
            onCheckAllChange?.(checked);
          }}
        />
      );
    },
    cell: (info) => {
      const { onCheckboxChange } = info.table.options.meta!;
      const item = info.getValue();

      return (
        <Checkbox
          checked={item.suggestWriteoff.value}
          onCheckedChange={({ checked }) =>
            onCheckboxChange?.(item.employee.id, Boolean(checked))
          }
        />
      );
    },
  }),
  columnHelper.accessor("employee.id", {
    header: () => (
      <Text fontSize={16} fontWeight="semibold">
        ID
      </Text>
    ),
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("employee.name", {
    header: () => (
      <Text fontSize={16} fontWeight="semibold">
        NAME
      </Text>
    ),
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("originalAmount", {
    header: () => (
      <Text fontSize={16} fontWeight="semibold">
        ORIGINAL AMOUNT
      </Text>
    ),
    cell: (info) => currency(info.getValue()),
  }),
  columnHelper.accessor("paidAmount", {
    header: () => (
      <Text fontSize={16} fontWeight="semibold">
        PAID AMOUNT
      </Text>
    ),
    cell: (info) => currency(info.getValue()),
  }),
  columnHelper.accessor("outstandingAmount", {
    header: () => (
      <Text fontSize={16} fontWeight="semibold">
        OUTSTANDING AMOUNT
      </Text>
    ),
    cell: (info) => currency(info.getValue()),
  }),
  columnHelper.accessor("remainingAmount.value", {
    header: () => (
      <Text fontSize={16} fontWeight="semibold">
        REMAINING AMOUNT
      </Text>
    ),
    cell: (info) => currency(info.getValue()),
  }),
  columnHelper.accessor((deduction) => deduction, {
    id: "amount",
    header: () => (
      <Text fontSize={16} fontWeight="semibold">
        ROLLOVER AMOUNT
      </Text>
    ),
    cell: (info) => {
      const item = info.getValue();
      const { updateData } = info.table.options.meta!;

      return (
        <Input
          value={item.amount.value}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (!isNaN(value)) {
              updateData(item.employee.id, Number(e.target.value));
            }
          }}
        />
      );
    },
  }),
];

type DeductionsTableProps = {
  data: InvoiceDeductionState[];
  onFieldChange?: (field: string, value: number) => void;
  onCheckboxChange?: (field: string, value: boolean) => void;
  onCheckAllChange?: (value: CheckedState) => void;
  checkAllValue?: CheckedState;
};

export const DeductionsVirtualTable = ({
  data,
  onFieldChange,
  onCheckAllChange,
  onCheckboxChange,
  checkAllValue,
}: DeductionsTableProps) => {
  const parentRef = useRef<HTMLDivElement | null>(null);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: (field, value) => {
        onFieldChange?.(field, value);
      },
      onCheckboxChange,
      onCheckAllChange,
      checkAllValue,
    },
  });

  const { rows } = table.getRowModel();

  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 45,
    overscan: 20,
  });

  return (
    <Box
      ref={parentRef}
      width="full"
      style={{
        height: "calc(100vh - 276px)",
        overflow: "auto",
        position: "relative",
      }}
    >
      <Box width="full" style={{ height: `${virtualizer.getTotalSize()}px` }}>
        <Table.Root>
          <Table.Header
            style={{
              position: "sticky",
              top: 0,
              zIndex: 10,
            }}
          >
            {table.getHeaderGroups().map((headerGroups) => (
              <Table.Row key={headerGroups.id}>
                {headerGroups.headers.map((header) => (
                  <Table.ColumnHeader key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </Table.ColumnHeader>
                ))}
              </Table.Row>
            ))}
          </Table.Header>
          <Table.Body>
            {virtualizer.getVirtualItems().map((virtualRow, index) => {
              const row = rows[virtualRow.index];

              return (
                <Table.Row
                  key={row.id}
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${
                      virtualRow.start - index * virtualRow.size
                    }px)`,
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <Table.Cell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Table.Cell>
                  ))}
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Root>
      </Box>
    </Box>
  );
};
