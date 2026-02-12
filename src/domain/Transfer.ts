import { Result } from "../types/Results";

export class Transfer {
  fromAccountNumber: string;
  toAccountNumber: string;
  amount: number;

  constructor(
    fromAccountNumber: string,
    toAccountNumber: string,
    amount: number,
  ) {
    this.fromAccountNumber = fromAccountNumber;
    this.toAccountNumber = toAccountNumber;
    this.amount = amount;
  }

  validate(): Result {
    if (this.fromAccountNumber === this.toAccountNumber) {
      return {
        state: 'failure',
        errorMessage: "Cannot transfer to the same account",
      };
    }

    if (this.amount <= 0) {
      return {
        state: 'failure',
        errorMessage: "Transfer amount must be greater than zero",
      };
    }

    return { state: 'success' };
  }
}
