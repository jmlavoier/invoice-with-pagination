import { deductions } from "./fake-deductions";
import { GetDeductedAmountPerEmployeeResponse } from "./types";
import { wait } from '../helpers';

const ITEMS_PER_PAGE = 20;

const createDeductionsResponse = (): GetDeductedAmountPerEmployeeResponse => {
  const totalItems = deductions.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  return {
    code: 200,
    data: {
      page: 0,
      total_pages: totalPages,
      total_items: totalItems,
      items: deductions,
    },
  };
};

export const getDeductions = async () => {
  await wait(2000);
  return createDeductionsResponse();
};
