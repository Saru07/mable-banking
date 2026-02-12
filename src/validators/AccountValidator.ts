import { IValidator } from "../interfaces/IValidator";
import { Result } from "../types/Results";

export class AccountValidator implements IValidator {
  validate(record: string[]): Result {
    if (record.length !== 2) {
      return {
        state: "failure",
        errorMessage: "Account record must have 2 fields",
      };
    }

    const accountNumber = (record[0] ?? "").trim();
    const balanceStr = (record[1] ?? "").trim();

    if (!accountNumber || accountNumber.trim() === "") {
      return {
        state: "failure",
        errorMessage: "Account number cannot be empty",
      };
    }

    if (!balanceStr || balanceStr.trim() === "") {
      return {
        state: "failure",
        errorMessage: "Balance cannot be empty",
      };
    }

    // Validate account number (16 digits)
    if (!/^\d{16}$/.test(accountNumber)) {
      return {
        state: "failure",
        errorMessage: "Invalid account number - must be exactly 16 digits",
      };
    }

    // Validate balance
    const balance = parseFloat(balanceStr);
    if (isNaN(balance)) {
      return {
        state: "failure",
        errorMessage: "Invalid balance - must be a number",
      };
    }

    if (balance < 0) {
      return {
        state: "failure",
        errorMessage: "Invalid balance - cannot be negative",
      };
    }
    return { state: "success" };
  }
}
