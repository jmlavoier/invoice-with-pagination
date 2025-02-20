import { Input, Table, Text } from "@chakra-ui/react";
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
import { useState } from "react";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (field: string, value: number) => void;
    onCheckboxChange?: (field: string, value: boolean) => void;
    onCheckAllChange?: (value: boolean) => void;
  }
}

const columnHelper = createColumnHelper<InvoiceDeductionState>();

const columns = [
  columnHelper.accessor((deduction) => deduction, {
    id: "suggest-writeoff",
    header: (info) => {
      const [value, setValue] = useState<boolean>(false);

      return (
        <Checkbox
          checked={value}
          onCheckedChange={({ checked }) => {
            setValue(Boolean(checked));
            info.table.options.meta?.onCheckAllChange?.(Boolean(checked));
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
            updateData(item.employee.id, Number(e.target.value));
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
  onCheckAllChange?: (value: boolean) => void;
};

export const DeductionsTable = ({
  data,
  onFieldChange,
  onCheckAllChange,
  onCheckboxChange,
}: DeductionsTableProps) => {
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
    },
  });

  return (
    <Table.Root>
      <Table.Header>
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
        {table.getRowModel().rows.map((row) => (
          <Table.Row key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <Table.Cell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};
