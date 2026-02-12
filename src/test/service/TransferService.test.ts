import { AccountsService } from '../../service/AccountsService';
import { TransferService } from '../../service/TransferService';
import { TransferCsvRow, AccountCsvRow } from '../../types/CsvRows';

describe('TransferService', () => {
  describe('constructor', () => {
    it('should initialize with valid transfer records', () => {
      const records: TransferCsvRow[] = [
        { fromAccountNumber: '1234567890123456', toAccountNumber: '6543210987654321', amount: 100 }
      ];

      const service = new TransferService(records);

      expect(service).toBeDefined()
    });

    it('should handle empty records', () => {
      const service = new TransferService([]);

      expect(service).toBeDefined()
    });
  });

  describe('processTransfers', () => {
    it('should process valid transfer successfully', () => {
      const accountRecords: AccountCsvRow[] = [
        { accountNumber: '1234567890123456', balance: 1000 },
        { accountNumber: '6543210987654321', balance: 500 }
      ];
      const transferRecords: TransferCsvRow[] = [
        { fromAccountNumber: '1234567890123456', toAccountNumber: '6543210987654321', amount: 100 }
      ];

      const accountsService = new AccountsService(accountRecords);
      const transferService = new TransferService(transferRecords);

      transferService.processTransfers(accountsService);

      expect(transferService.getSuccessCount()).toBe(1);
      expect(transferService.getFailureCount()).toBe(0);
    });

    it('should fail when source account does not exist', () => {
      const accountRecords: AccountCsvRow[] = [
        { accountNumber: '6543210987654321', balance: 500 }
      ];
      const transferRecords: TransferCsvRow[] = [
        { fromAccountNumber: '1234567890123456', toAccountNumber: '6543210987654321', amount: 100 }
      ];

      const accountsService = new AccountsService(accountRecords);
      const transferService = new TransferService(transferRecords);

      transferService.processTransfers(accountsService);

      expect(transferService.getSuccessCount()).toBe(0);
      expect(transferService.getFailureCount()).toBe(1);
    });

    it('should fail when destination account does not exist', () => {
      const accountRecords: AccountCsvRow[] = [
        { accountNumber: '1234567890123456', balance: 1000 }
      ];
      const transferRecords: TransferCsvRow[] = [
        { fromAccountNumber: '1234567890123456', toAccountNumber: '6543210987654321', amount: 100 }
      ];

      const accountsService = new AccountsService(accountRecords);
      const transferService = new TransferService(transferRecords);

      transferService.processTransfers(accountsService);

      expect(transferService.getSuccessCount()).toBe(0);
      expect(transferService.getFailureCount()).toBe(1);
    });

    it('should fail when source account has insufficient balance', () => {
      const accountRecords: AccountCsvRow[] = [
        { accountNumber: '1234567890123456', balance: 50 },
        { accountNumber: '6543210987654321', balance: 500 }
      ];
      const transferRecords: TransferCsvRow[] = [
        { fromAccountNumber: '1234567890123456', toAccountNumber: '6543210987654321', amount: 100 }
      ];

      const accountsService = new AccountsService(accountRecords);
      const transferService = new TransferService(transferRecords);

      transferService.processTransfers(accountsService);

      expect(transferService.getSuccessCount()).toBe(0);
      expect(transferService.getFailureCount()).toBe(1);
    });

    it('should fail when transferring to same account', () => {
      const accountRecords: AccountCsvRow[] = [
        { accountNumber: '1234567890123456', balance: 1000 }
      ];
      const transferRecords: TransferCsvRow[] = [
        { fromAccountNumber: '1234567890123456', toAccountNumber: '1234567890123456', amount: 100 }
      ];

      const accountsService = new AccountsService(accountRecords);
      const transferService = new TransferService(transferRecords);

      transferService.processTransfers(accountsService);

      expect(transferService.getSuccessCount()).toBe(0);
      expect(transferService.getFailureCount()).toBe(1);
    });

    it('should fail when transfer amount is zero', () => {
      const accountRecords: AccountCsvRow[] = [
        { accountNumber: '1234567890123456', balance: 1000 },
        { accountNumber: '6543210987654321', balance: 500 }
      ];
      const transferRecords: TransferCsvRow[] = [
        { fromAccountNumber: '1234567890123456', toAccountNumber: '6543210987654321', amount: 0 }
      ];

      const accountsService = new AccountsService(accountRecords);
      const transferService = new TransferService(transferRecords);

      transferService.processTransfers(accountsService);

      expect(transferService.getSuccessCount()).toBe(0);
      expect(transferService.getFailureCount()).toBe(1);
    });

    it('should fail when transfer amount is negative', () => {
      const accountRecords: AccountCsvRow[] = [
        { accountNumber: '1234567890123456', balance: 1000 },
        { accountNumber: '6543210987654321', balance: 500 }
      ];
      const transferRecords: TransferCsvRow[] = [
        { fromAccountNumber: '1234567890123456', toAccountNumber: '6543210987654321', amount: -100 }
      ];

      const accountsService = new AccountsService(accountRecords);
      const transferService = new TransferService(transferRecords);

      transferService.processTransfers(accountsService);

      expect(transferService.getSuccessCount()).toBe(0);
      expect(transferService.getFailureCount()).toBe(1);
    });

    it('should process multiple transfers correctly', () => {
      const accountRecords: AccountCsvRow[] = [
        { accountNumber: '1234567890123456', balance: 1000 },
        { accountNumber: '6543210987654321', balance: 500 },
        { accountNumber: '1111222233334444', balance: 750 }
      ];
      const transferRecords: TransferCsvRow[] = [
        { fromAccountNumber: '1234567890123456', toAccountNumber: '6543210987654321', amount: 100 },
        { fromAccountNumber: '6543210987654321', toAccountNumber: '1111222233334444', amount: 50 },
        { fromAccountNumber: '1111222233334444', toAccountNumber: '1234567890123456', amount: 25 }
      ];

      const accountsService = new AccountsService(accountRecords);
      const transferService = new TransferService(transferRecords);

      transferService.processTransfers(accountsService);

      expect(transferService.getSuccessCount()).toBe(3);
      expect(transferService.getFailureCount()).toBe(0);
    });

    it('should process mix of successful and failed transfers', () => {
      const accountRecords: AccountCsvRow[] = [
        { accountNumber: '1234567890123456', balance: 1000 },
        { accountNumber: '6543210987654321', balance: 500 }
      ];
      const transferRecords: TransferCsvRow[] = [
        { fromAccountNumber: '1234567890123456', toAccountNumber: '6543210987654321', amount: 100 }, // Success
        { fromAccountNumber: '6543210987654321', toAccountNumber: '9999999999999999', amount: 50 }, // Fail - account doesn't exist
        { fromAccountNumber: '6543210987654321', toAccountNumber: '1234567890123456', amount: 200 } // Success
      ];

      const accountsService = new AccountsService(accountRecords);
      const transferService = new TransferService(transferRecords);

      transferService.processTransfers(accountsService);

      expect(transferService.getSuccessCount()).toBe(2);
      expect(transferService.getFailureCount()).toBe(1);
    });

    it('should not modify balances on failed transfers', () => {
      const accountRecords: AccountCsvRow[] = [
        { accountNumber: '1234567890123456', balance: 50 },
        { accountNumber: '6543210987654321', balance: 500 }
      ];
      const transferRecords: TransferCsvRow[] = [
        { fromAccountNumber: '1234567890123456', toAccountNumber: '6543210987654321', amount: 100 } // Fail
      ];

      const accountsService = new AccountsService(accountRecords);
      const transferService = new TransferService(transferRecords);

      transferService.processTransfers(accountsService);

      const exported = accountsService.exportAccounts();
      expect(exported[0]).toEqual(['1234567890123456', '50']); // Unchanged
      expect(exported[1]).toEqual(['6543210987654321', '500']); // Unchanged
    });
  });

  describe('exportFailureLogs', () => {
    it('should export only failed transfers', () => {
      const accountRecords: AccountCsvRow[] = [
        { accountNumber: '1234567890123456', balance: 1000 },
        { accountNumber: '6543210987654321', balance: 500 }
      ];
      const transferRecords: TransferCsvRow[] = [
        { fromAccountNumber: '1234567890123456', toAccountNumber: '6543210987654321', amount: 100 }, // Success
        { fromAccountNumber: '6543210987654321', toAccountNumber: '9999999999999999', amount: 50 } // Fail
      ];

      const accountsService = new AccountsService(accountRecords);
      const transferService = new TransferService(transferRecords);

      transferService.processTransfers(accountsService);

      const logs = transferService.exportFailureLogs();

      expect(logs).toHaveLength(1);
      expect(logs[0]![0]).toBe('6543210987654321');
      expect(logs[0]![1]).toBe('9999999999999999');
      expect(logs[0]![2]).toBe('50');
      expect(logs[0]![3]).toContain('does not exist');
    });

    it('should export empty array when all transfers succeed', () => {
      const accountRecords: AccountCsvRow[] = [
        { accountNumber: '1234567890123456', balance: 1000 },
        { accountNumber: '6543210987654321', balance: 500 }
      ];
      const transferRecords: TransferCsvRow[] = [
        { fromAccountNumber: '1234567890123456', toAccountNumber: '6543210987654321', amount: 100 }
      ];

      const accountsService = new AccountsService(accountRecords);
      const transferService = new TransferService(transferRecords);

      transferService.processTransfers(accountsService);

      const logs = transferService.exportFailureLogs();

      expect(logs).toHaveLength(0);
    });

    it('should export all failures when all transfers fail', () => {
      const accountRecords: AccountCsvRow[] = [
        { accountNumber: '1234567890123456', balance: 50 }
      ];
      const transferRecords: TransferCsvRow[] = [
        { fromAccountNumber: '1234567890123456', toAccountNumber: '6543210987654321', amount: 100 }, // Account doesn't exist
        { fromAccountNumber: '1234567890123456', toAccountNumber: '1234567890123456', amount: 100 } // Same account
      ];

      const accountsService = new AccountsService(accountRecords);
      const transferService = new TransferService(transferRecords);

      transferService.processTransfers(accountsService);

      const logs = transferService.exportFailureLogs();

      expect(logs).toHaveLength(2);
    });
  });
});
