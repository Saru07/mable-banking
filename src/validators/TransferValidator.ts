import { IValidator } from "../interfaces/IValidator";

export class TransferValidator implements IValidator {
  validate(record: string[], lineNumber: number): void {
    if (record.length !== 3) {
      throw new Error(
        `Line ${lineNumber}: Invalid format - expected 3 columns (fromAccount,toAccount,amount), got ${record.length}`,
      );
    }

    const fromAccount = (record[0] || "").trim();
    const toAccount = (record[1] || "").trim();
    const amountStr = (record[2] || "").trim();

    // Validate from account number (16 digits)
    if (!/^\d{16}$/.test(fromAccount)) {
      throw new Error(
        `Line ${lineNumber}: Invalid from account - must be exactly 16 digits`,
      );
    }

    // Validate to account number (16 digits)
    if (!/^\d{16}$/.test(toAccount)) {
      throw new Error(
        `Line ${lineNumber}: Invalid to account - must be exactly 16 digits`,
      );
    }

    // Validate amount
    const amount = parseFloat(amountStr);
    if (isNaN(amount)) {
      throw new Error(`Line ${lineNumber}: Invalid amount - must be a number`);
    }

    if (amount <= 0) {
      throw new Error(
        `Line ${lineNumber}: Invalid amount - must be greater than zero`,
      );
    }
  }
}
