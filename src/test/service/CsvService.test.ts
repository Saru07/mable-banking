import { AccountCsvRowMapper } from '../../mapper/AccountCsvRowMapper';
import { TransferCsvRowMapper } from '../../mapper/TransferCsvRowMapper';
import { CsvService } from '../../service/CsvService';
import { AccountValidator } from '../../validators/AccountValidator';
import { TransferValidator } from '../../validators/TransferValidator';
import * as fs from 'fs';
import * as path from 'path';

describe('CsvService', () => {
  let csvService: CsvService;
  const fixturesPath = path.join(__dirname, '../fixtures');
  const outputPath = path.join(__dirname, '../fixtures/output');

  beforeEach(() => {
    csvService = new CsvService();
    
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

  describe('load', () => {
    it('should load valid account CSV file', async () => {
      const filePath = path.join(fixturesPath, 'valid-accounts.csv');
      
      const result = await csvService.load(
        filePath,
        new AccountValidator(),
        new AccountCsvRowMapper()
      );

      expect(result).toHaveLength(2);
      expect(result[0]?.accountNumber).toBe('1234567890123456');
      expect(result[0]?.balance).toBe(1000);
      expect(result[1]?.accountNumber).toBe('6543210987654321');
      expect(result[1]?.balance).toBe(500);
    });

    it('should load valid transfer CSV file', async () => {
      const filePath = path.join(fixturesPath, 'valid-transfers.csv');
      
      const result = await csvService.load(
        filePath,
        new TransferValidator(),
        new TransferCsvRowMapper()
      );

      expect(result).toHaveLength(2);
      expect(result[0]?.fromAccountNumber).toBe('1234567890123456');
      expect(result[0]?.toAccountNumber).toBe('6543210987654321');
      expect(result[0]?.amount).toBe(100);
    });

    it('should reject invalid account CSV file', async () => {
      const filePath = path.join(fixturesPath, 'invalid-accounts.csv');
      
      await expect(
        csvService.load(
          filePath,
          new AccountValidator(),
          new AccountCsvRowMapper()
        )
      ).rejects.toThrow('Invalid balance');
    });

    it('should reject non-existent file', async () => {
      const filePath = path.join(fixturesPath, 'does-not-exist.csv');
      
      await expect(
        csvService.load(
          filePath,
          new AccountValidator(),
          new AccountCsvRowMapper()
        )
      ).rejects.toThrow();
    });
  });

  describe('write', () => {
    it('should write valid account data to CSV file', async () => {
      const filePath = path.join(outputPath, 'test-accounts.csv');
      const records = [
        ['1234567890123456', '1000'],
        ['6543210987654321', '500']
      ];

      await csvService.write(filePath, records);

      // Verify file exists
      expect(fs.existsSync(filePath)).toBe(true);

      // Verify file content
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toContain('1234567890123456');
      expect(content).toContain('1000');
      expect(content).toContain('6543210987654321');
      expect(content).toContain('500');
    });

    it('should write valid transfer data to CSV file', async () => {
      const filePath = path.join(outputPath, 'test-transfers.csv');
      const records = [
        ['1234567890123456', '6543210987654321', '100'],
        ['6543210987654321', '1234567890123456', '50']
      ];

      await csvService.write(filePath, records);

      // Verify file exists
      expect(fs.existsSync(filePath)).toBe(true);

      // Verify file content
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toContain('1234567890123456');
      expect(content).toContain('6543210987654321');
      expect(content).toContain('100');
      expect(content).toContain('50');
    });

    it('should not create file when records are empty', async () => {
      const filePath = path.join(outputPath, 'empty.csv');
      const records: string[][] = [];

      await csvService.write(filePath, records);

      // Verify file does not exist
      expect(fs.existsSync(filePath)).toBe(false);
    });

    it('should handle single record', async () => {
      const filePath = path.join(outputPath, 'single.csv');
      const records = [
        ['1234567890123456', '1000']
      ];

      await csvService.write(filePath, records);

      expect(fs.existsSync(filePath)).toBe(true);
    });
  });
});
