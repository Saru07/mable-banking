import { TransferCsvRowMapper } from "../../mapper/TransferCsvRowMapper";

describe('TransferCsvRowMapper', () => {
  let mapper: TransferCsvRowMapper;

  beforeEach(() => {
    mapper = new TransferCsvRowMapper();
  });

  describe('map', () => {
    it('should map valid string array to TransferCsvRow', () => {
      const values = ['1234567890123456', '6543210987654321', '100'];

      const result = mapper.map(values);

      expect(result.fromAccountNumber).toBe('1234567890123456');
      expect(result.toAccountNumber).toBe('6543210987654321');
      expect(result.amount).toBe(100);
    });

    it('should handle decimal amounts', () => {
      const values = ['1234567890123456', '6543210987654321', '123.45'];

      const result = mapper.map(values);

      expect(result.fromAccountNumber).toBe('1234567890123456');
      expect(result.toAccountNumber).toBe('6543210987654321');
      expect(result.amount).toBe(123.45);
    });

    it('should handle very small decimal amounts', () => {
      const values = ['1234567890123456', '6543210987654321', '0.01'];

      const result = mapper.map(values);

      expect(result.fromAccountNumber).toBe('1234567890123456');
      expect(result.toAccountNumber).toBe('6543210987654321');
      expect(result.amount).toBe(0.01);
    });

    it('should handle large amounts', () => {
      const values = ['1234567890123456', '6543210987654321', '999999999.99'];

      const result = mapper.map(values);

      expect(result.fromAccountNumber).toBe('1234567890123456');
      expect(result.toAccountNumber).toBe('6543210987654321');
      expect(result.amount).toBe(999999999.99);
    });

    it('should handle same account numbers', () => {
      const values = ['1234567890123456', '1234567890123456', '100'];

      const result = mapper.map(values);

      expect(result.fromAccountNumber).toBe('1234567890123456');
      expect(result.toAccountNumber).toBe('1234567890123456');
      expect(result.amount).toBe(100);
    });
  });
});