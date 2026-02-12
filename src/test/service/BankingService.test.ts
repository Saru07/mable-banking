import * as fs from 'fs';
import * as path from 'path';
import { BankingService } from '../../service/BankingService';

describe('BankingService', () => {
  let bankingService: BankingService;
  const fixturesPath = path.join(__dirname, '../fixtures/integration');
  const outputPath = path.join(__dirname, '../fixtures/integration/output');

  beforeEach(() => {
    bankingService = new BankingService();
    
    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }
  });

  afterEach(() => {
    // Clean up output files
    if (fs.existsSync(outputPath)) {
      const files = fs.readdirSync(outputPath);
      files.forEach(file => {
        fs.unlinkSync(path.join(outputPath, file));
      });
    }
  });

  describe('run', () => {
    it('should process all successful transfers', async () => {
      const accountsFile = path.join(fixturesPath, 'accounts.csv');
      const transfersFile = path.join(fixturesPath, 'transfers.csv');
      const outputFile = path.join(outputPath, 'accounts-output.csv');
      const logFile = path.join(outputPath, 'failures.log');

      await bankingService.run(accountsFile, transfersFile, outputFile, logFile);

      // Verify output file exists
      expect(fs.existsSync(outputFile)).toBe(true);

      // Verify log file does not exist (no failures)
      expect(fs.existsSync(logFile)).toBe(false);

      // Verify account balances
      const content = fs.readFileSync(outputFile, 'utf-8');
      const lines = content.trim().split('\n');
      
      expect(lines).toHaveLength(3);
      
      // Parse and check balances
      const accounts = lines.map(line => {
        const [accountNumber, balance] = line.split(',');
        return { accountNumber, balance: parseFloat(balance ?? '') };
      });

      const account1 = accounts.find(a => a.accountNumber === '1234567890123456');
      const account2 = accounts.find(a => a.accountNumber === '6543210987654321');
      const account3 = accounts.find(a => a.accountNumber === '1111222233334444');

      // 1234567890123456: 1000 - 100 + 25 = 925
      expect(account1?.balance).toBe(925);
      
      // 6543210987654321: 500 + 100 - 50 = 550
      expect(account2?.balance).toBe(550);
      
      // 1111222233334444: 750 + 50 - 25 = 775
      expect(account3?.balance).toBe(775);
    });

    it('should handle transfers with failures', async () => {
      const accountsFile = path.join(fixturesPath, 'accounts.csv');
      const transfersFile = path.join(fixturesPath, 'transfers-with-failures.csv');
      const outputFile = path.join(outputPath, 'accounts-output.csv');
      const logFile = path.join(outputPath, 'failures.log');

      await bankingService.run(accountsFile, transfersFile, outputFile, logFile);

      // Verify output file exists
      expect(fs.existsSync(outputFile)).toBe(true);

      // Verify log file exists (has failures)
      expect(fs.existsSync(logFile)).toBe(true);

      // Verify log file content
      const logContent = fs.readFileSync(logFile, 'utf-8');
      expect(logContent).toContain('6543210987654321');
      expect(logContent).toContain('9999999999999999');
      expect(logContent).toContain('does not exist');

      // Verify account balances (only successful transfers applied)
      const accountContent = fs.readFileSync(outputFile, 'utf-8');
      const lines = accountContent.trim().split('\n');
      const accounts = lines.map(line => {
        const [accountNumber, balance] = line.split(',');
        return { accountNumber, balance: parseFloat(balance ?? '') };
      });

      const account1 = accounts.find(a => a.accountNumber === '1234567890123456');
      const account2 = accounts.find(a => a.accountNumber === '6543210987654321');
      const account3 = accounts.find(a => a.accountNumber === '1111222233334444');

      // Transfer 1 succeeds: 1234567890123456 -100, 6543210987654321 +100
      // Transfer 2 fails: no change
      // Transfer 3 succeeds: 1111222233334444 -25, 1234567890123456 +25
      
      expect(account1?.balance).toBe(925); // 1000 - 100 + 25
      expect(account2?.balance).toBe(600); // 500 + 100
      expect(account3?.balance).toBe(725); // 750 - 25
    });

    it('should reject invalid accounts file', async () => {
      const accountsFile = path.join(fixturesPath, '../invalid-accounts.csv');
      const transfersFile = path.join(fixturesPath, 'transfers.csv');
      const outputFile = path.join(outputPath, 'accounts-output.csv');
      const logFile = path.join(outputPath, 'failures.log');

      await expect(
        bankingService.run(accountsFile, transfersFile, outputFile, logFile)
      ).rejects.toThrow();
    });

    it('should handle non-existent accounts file', async () => {
      const accountsFile = path.join(fixturesPath, 'does-not-exist.csv');
      const transfersFile = path.join(fixturesPath, 'transfers.csv');
      const outputFile = path.join(outputPath, 'accounts-output.csv');
      const logFile = path.join(outputPath, 'failures.log');

      await expect(
        bankingService.run(accountsFile, transfersFile, outputFile, logFile)
      ).rejects.toThrow();
    });

    it('should handle non-existent transfers file', async () => {
      const accountsFile = path.join(fixturesPath, 'accounts.csv');
      const transfersFile = path.join(fixturesPath, 'does-not-exist.csv');
      const outputFile = path.join(outputPath, 'accounts-output.csv');
      const logFile = path.join(outputPath, 'failures.log');

      await expect(
        bankingService.run(accountsFile, transfersFile, outputFile, logFile)
      ).rejects.toThrow();
    });
  });
});
