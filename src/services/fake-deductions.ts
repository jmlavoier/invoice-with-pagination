import { faker } from "@faker-js/faker";

import { InvoiceDeduction } from "./types";

const MAX_EWA = 2000;

const createDeductionAmountPerEmployee = (): InvoiceDeduction => {
  const originalAmount = faker.number.float() * MAX_EWA;
  const paidAmount = faker.number.float() * MAX_EWA;

  return {
    employee: {
      id: faker.string.uuid(),
      name: faker.internet.displayName(),
      email: faker.internet.email(),
      hr_employee_code: faker.internet.username(),
    },
    user: {
      id: faker.string.uuid(),
    },
    outstanding_amount: originalAmount - paidAmount,
    adjustment_amount: 0,
    original_amount: originalAmount,
    paid_amount: paidAmount,
  };
};

/* @ts-ignore: there is multiple */
export const deductions: InvoiceDeduction[] = faker.helpers.multiple(
  createDeductionAmountPerEmployee,
  {
    count: 4000,
  }
);
