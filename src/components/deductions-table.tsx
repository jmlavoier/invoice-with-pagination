import { Flex, Input, Table } from "@chakra-ui/react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  RowData,
} from "@tanstack/react-table";
import { currency } from "../helpers";
import { InvoiceDeductionState } from "../types";
import { useDebugValue, useEffect } from "react";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (field: string, value: number) => void;
  }
}

const columnHelper = createColumnHelper<InvoiceDeductionState>();

const columns = [
  columnHelper.accessor("employee.id", {
    header: "ID",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("employee.name", {
    header: "NAME",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("employee.hrEmployeeCode", {
    header: "COMPANY CODE",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("originalAmount", {
    header: "ORIGINAL AMOUNT",
    cell: (info) => currency(info.getValue()),
  }),
  columnHelper.accessor("paidAmount", {
    header: "PAID AMOUNT",
    cell: (info) => currency(info.getValue()),
  }),
  columnHelper.accessor("outstandingAmount", {
    header: "OUTSTANDING AMOUNT",
    cell: (info) => currency(info.getValue()),
  }),
  columnHelper.accessor("remainingAmount.value", {
    header: "REMAINING AMOUNT",
    cell: (info) => currency(info.getValue()),
  }),
  columnHelper.accessor((deduction) => deduction, {
    header: "ROLLOVER AMOUNT",
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
};

export const DeductionsTable = ({
  data,
  onFieldChange,
}: DeductionsTableProps) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: (field, value) => {
        onFieldChange?.(field, value);
      },
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
