import { AccountCsvRowMapper } from "../../mapper/AccountCsvRowMapper";

describe('AccountCsvRowMapper', () => {
  let mapper: AccountCsvRowMapper;

  beforeEach(() => {
    mapper = new AccountCsvRowMapper();
  });

  describe('map', () => {
    it('should map valid string array to AccountCsvRow', () => {
      const values = ['1234567890123456', '1000'];

      const result = mapper.map(values);

      expect(result.accountNumber).toBe('1234567890123456');
      expect(result.balance).toBe(1000);
    });

    it('should handle zero balance', () => {
      const values = ['1234567890123456', '0'];

      const result = mapper.map(values);

      expect(result.accountNumber).toBe('1234567890123456');
      expect(result.balance).toBe(0);
    });

    it('should handle decimal balance', () => {
      const values = ['1234567890123456', '1234.56'];

      const result = mapper.map(values);

      expect(result.accountNumber).toBe('1234567890123456');
      expect(result.balance).toBe(1234.56);
    });

    it('should handle very small decimal values', () => {
      const values = ['1234567890123456', '0.01'];

      const result = mapper.map(values);

      expect(result.accountNumber).toBe('1234567890123456');
      expect(result.balance).toBe(0.01);
    });

    it('should handle large balance values', () => {
      const values = ['1234567890123456', '999999999.99'];

      const result = mapper.map(values);

      expect(result.accountNumber).toBe('1234567890123456');
      expect(result.balance).toBe(999999999.99);
    });
  });
});
