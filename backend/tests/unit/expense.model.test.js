// Use ESM syntax for Vitest

import { describe, it, expect } from "vitest";
import Expense from "../../models/Expense.js"; 

const VALID_USER_ID = "507f1f77bcf86cd799439011";

describe("Expense model validation (unit)", () => {
  it("should fail when required fields are missing (userId/category/amount)", () => {
    const doc = new Expense({});
    const err = doc.validateSync();

    expect(err).toBeTruthy();
    expect(err.errors.userId).toBeTruthy();
    expect(err.errors.category).toBeTruthy();
    expect(err.errors.amount).toBeTruthy();
  });

  it("should throw a CastError when amount is not a number", () => {
    const doc = new Expense({
      userId: VALID_USER_ID,
      category: "Food",
      amount: "abc",
    });

    const err = doc.validateSync();
    expect(err).toBeTruthy();
    expect(err.errors.amount.name).toBe("CastError");
  });

  it("should pass validation when data is valid", () => {
    const doc = new Expense({
      userId: VALID_USER_ID,
      category: "Transport",
      amount: 12.5,
    });

    const err = doc.validateSync();
    expect(err).toBeUndefined();
  });
});
