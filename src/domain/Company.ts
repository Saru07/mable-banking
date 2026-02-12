import { Account } from "./Account";

export class Company {
  private accounts: Map<string, Account>;

  constructor(accounts: Map<string, Account>) {
    this.accounts = accounts;
  }

  getAllAcounts(): Map<string, Account> {
    return this.accounts;
  }
}
