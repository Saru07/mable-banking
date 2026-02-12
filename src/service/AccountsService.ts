import { IAccountsService } from "../interfaces/IAccountsService";
import { Account } from "../domain/Account";
import { Result } from "../types/Results";

export class AccountsService implements IAccountsService {
  private accounts: Map<string, Account>;

  constructor(records: string[][]) {
    this.accounts = this.buildAccountMap(records);
  }

  getAccount(accountNumber: string): Account | undefined {
    return this.accounts.get(accountNumber);
  }

  hasAccount(accountNumber: string): boolean {
    return this.accounts.has(accountNumber);
  }

  getAccountCount(): number {
    return this.accounts.size;
  }

  debit(accountNumber: string, amount: number): Result {
    const account = this.accounts.get(accountNumber);
    if (!account) {
      return {
        state: "failure",
        errorMessage: `Account ${accountNumber} not found`,
      };
    }
    return account.debit(amount);
  }

  credit(accountNumber: string, amount: number): Result {
    const account = this.accounts.get(accountNumber);
    if (!account) {
      return {
        state: "failure",
        errorMessage: `Account ${accountNumber} not found`,
      };
    }
    return account.credit(amount);
  }

  exportAccounts(): string[][] {
    const records: string[][] = [];
    this.accounts.forEach((account) => {
      records.push([account.accountNumber, account.balance.toString()]);
    });
    return records;
  }

  private buildAccountMap(records: string[][]): Map<string, Account> {
    const map = new Map<string, Account>();

    records.forEach((record, index) => {
      const accountNumber = record[0] ?? "";
      const balance = parseFloat(record[1] ?? "");

      if (map.has(accountNumber)) {
        console.warn(
          `⚠️  Duplicate account ${accountNumber} at line ${index + 1} - skipping`,
        );
        return;
      }

      const account = new Account(accountNumber, balance);
      map.set(accountNumber, account);
    });

    return map;
  }
}
