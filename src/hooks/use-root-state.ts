import { useMemo, useState } from "react";
import { InvoiceDeductionState, RootState } from "../types";

const ITEMS_PER_PAGE = 10;

export const useRootState = (): RootState => {
  const [page, setPage] = useState<number>(0);
  const [deductions, setDeductions] = useState<InvoiceDeductionState[]>();
  const [searchValue, setSearchValue] = useState<string>("");

  console.log("searchValue", searchValue);

  const filteredDeductions = useMemo(() => {
    return (
      deductions?.filter((deduc) => {
        if (!searchValue) {
          return true;
        }

        return deduc.employee.name
          .toLocaleLowerCase()
          .includes(searchValue.toLocaleLowerCase());

        return false;
      }) || []
    );
  }, [deductions, searchValue]);

  const totalItems = filteredDeductions?.length || 0;
  const itemsPerPage = ITEMS_PER_PAGE;
  const pageCount = Math.ceil(totalItems / itemsPerPage);
  const end = page + itemsPerPage;

  const currentPage = useMemo(
    () =>
      filteredDeductions?.slice(
        page,
        end > totalItems - 1 ? totalItems - 1 : end
      ) || [],
    [filteredDeductions, page, end, totalItems]
  );

  console.log(currentPage);

  return {
    page,
    totalItems,
    itemsPerPage,
    pageCount,
    currentPage,
    filteredDeductions,
    deductions: deductions || [],
    setDeductions,
    setPage,
    setSearchValue,
  };
};
