import { useState } from "react";
import { InvoiceDeductionState, RootState } from "../types";

const ITEMS_PER_PAGE = 10;

export const useRootState = (): RootState => {
  const [page, setPage] = useState<number>(0);
  const [deductions, setDeductions] = useState<InvoiceDeductionState[]>();

  const totalItems = deductions?.length || 0;
  const itemsPerPage = ITEMS_PER_PAGE;
  const pageCount = Math.ceil(totalItems / itemsPerPage);
  const end = page + itemsPerPage;
  const currentPage =
    deductions?.slice(page, end > totalItems - 1 ? totalItems - 1 : end) || [];

  return {
    page,
    totalItems,
    itemsPerPage,
    pageCount,
    currentPage,
    deductions: deductions || [],
    setDeductions,
    setPage,
  };
};
