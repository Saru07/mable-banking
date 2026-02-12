import { Result } from "../types/Results";

export class Account {
  readonly accountNumber: string;
  balance: number;

  constructor(accountNumber: string, balance: number) {
    this.accountNumber = accountNumber;
    this.balance = balance;
  }

  debit(amount: number): Result {
    if (this.balance < amount) {
      return {
        state: 'failure',
        errorMessage: `Insufficient funds: balance ${this.balance}, required ${amount}`
      };
    }

    this.balance -= amount;
    return { state: 'success' };
  }

  credit(amount: number): Result {
    if (amount < 0) {
      return {
        state: 'failure',
        errorMessage: 'Cannot add zero or negative amount'
      };
    }

    this.balance += amount;
    return { state: 'success' };
  }


}
