import { IValidator } from "../interfaces/IValidator";
import { Result } from "../types/Results";

export class TransferValidator implements IValidator {
  validate(record: string[]): Result {
    if (record.length !== 3) {
      return {
        state: "failure",
        errorMessage: `Invalid format - expected 3 columns (fromAccount,toAccount,amount), got ${record.length}`,
      };
    }

    const fromAccount = (record[0] ?? "").trim();
    const toAccount = (record[1] ?? "").trim();
    const amountStr = (record[2] ?? "").trim();

    if (!fromAccount || fromAccount.trim() === '') {
      return { 
        state: 'failure', 
        errorMessage: 'From account cannot be empty' 
      };
    }

    if (!toAccount || toAccount.trim() === '') {
      return { 
        state: 'failure', 
        errorMessage: 'To account cannot be empty' 
      };
    }
    
    if (!amountStr || amountStr.trim() === '') {
      return { 
        state: 'failure', 
        errorMessage: 'Amount cannot be empty' 
      };
    }

    // Validate from account number (16 digits)
    if (!/^\d{16}$/.test(fromAccount)) {
      return { 
        state: 'failure', 
        errorMessage: 'Invalid from account - must be exactly 16 digits' 
      }
    }

    // Validate to account number (16 digits)
    if (!/^\d{16}$/.test(toAccount)) {
      return { 
        state: 'failure', 
        errorMessage: 'Invalid to account - must be exactly 16 digits' 
      }
    }

    // Validate amount
    const amount = parseFloat(amountStr);
    if (isNaN(amount)) {
      return { 
        state: 'failure', 
        errorMessage: 'Invalid amount - must be a number' 
      }
    }

    if (amount <= 0) {
      return { 
        state: 'failure', 
        errorMessage: 'Invalid amount - must be greater than zero' 
      }
    }
    return { state: 'success' };
  }
}
