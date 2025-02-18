import { Flex, Table } from "@chakra-ui/react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { currency } from "../helpers";
import { InvoiceDeductionState } from "../types";

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
];

type DeductionsTableProps = {
  data: InvoiceDeductionState[];
};

export const DeductionsTable = ({ data }: DeductionsTableProps) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
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
