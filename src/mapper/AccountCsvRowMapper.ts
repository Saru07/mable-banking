import { ICsvRowMapper } from '../interfaces/ICsvRowMapper';
import { AccountCsvRow } from '../types/CsvRows';

export class AccountCsvRowMapper implements ICsvRowMapper<AccountCsvRow> {
  map(values: string[]): AccountCsvRow {
    return {
      accountNumber: values[0] ?? '',
      balance: parseFloat(values[1] ?? '')
    };
  }
}
