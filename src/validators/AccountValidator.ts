import { IValidator } from "../interfaces/IValidator";

export class AccountValidator implements IValidator {
  validate(record: string[], lineNumber: number): void {
    if (record.length !== 2) {
      throw new Error(
        `Line ${lineNumber}: Invalid format - expected 2 columns (accountNumber,balance), got ${record.length}`,
      );
    }

    const accountNumber = (record[0] || "").trim();
    const balanceStr = (record[1] || "").trim();

    // Validate account number (16 digits)
    if (!/^\d{16}$/.test(accountNumber)) {
      throw new Error(
        `Line ${lineNumber}: Invalid account number - must be exactly 16 digits`,
      );
    }

    // Validate balance
    const balance = parseFloat(balanceStr);
    if (isNaN(balance)) {
      throw new Error(`Line ${lineNumber}: Invalid balance - must be a number`);
    }

    if (balance < 0) {
      throw new Error(
        `Line ${lineNumber}: Invalid balance - cannot be negative`,
      );
    }
  }
}
