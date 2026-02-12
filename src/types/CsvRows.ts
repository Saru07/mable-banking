export type AccountCsvRow = {
  accountNumber: string;
  balance: number;
};

export type TransferCsvRow = {
  fromAccountNumber: string;
  toAccountNumber: string;
  amount: number;
};