import { useCallback, useDebugValue, useMemo, useState } from "react";
import { CheckedState, InvoiceDeductionState, RootState } from "../types";

const ITEMS_PER_PAGE = 10;

export const useRootState = (): RootState => {
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [deductions, setDeductions] = useState<InvoiceDeductionState[]>();
  const [searchValue, setSearchValue] = useState<string>("");

  const filteredDeductions = useMemo(() => {
    return (
      deductions?.filter((deduc) => {
        if (!searchValue) {
          return true;
        }

        const res = deduc.employee.name
          .toLocaleLowerCase()
          .includes(searchValue.toLocaleLowerCase());

        return res;
      }) || []
    );
  }, [deductions, searchValue]);

  const totalItems = filteredDeductions?.length || 0;
  const itemsPerPage = ITEMS_PER_PAGE;
  const pageCount = Math.ceil(totalItems / itemsPerPage);
  const start = pageIndex * itemsPerPage;
  const end = start + itemsPerPage;

  const currentPage = useMemo(
    () =>
      filteredDeductions?.slice(start, end > totalItems ? totalItems : end) ||
      [],
    [filteredDeductions, pageIndex, end, totalItems]
  );

  const checkAllValue = useMemo((): CheckedState => {
    const isAllSelected =
      deductions?.every((deduction) => deduction.suggestWriteoff.value) ||
      false;
    const hasSomeSelected =
      deductions?.some((deduction) => deduction.suggestWriteoff.value) || false;

    const isIndeterminate = hasSomeSelected && !isAllSelected;

    return isIndeterminate ? "indeterminate" : isAllSelected;
  }, [deductions]);

  const setSearch = useCallback((value: string) => {
    // setPageIndex(0);
    setSearchValue(value);
  }, []);

  const setPage = useCallback((page: number) => {
    setPageIndex(page - 1);
  }, []);

  const root = {
    pageIndex,
    totalItems,
    itemsPerPage,
    pageCount,
    currentPage,
    filteredDeductions,
    deductions: deductions || [],
    checkAllValue,
    setDeductions,
    setPage,
    setSearch,
  };

  useDebugValue("root");

  return root;
};
