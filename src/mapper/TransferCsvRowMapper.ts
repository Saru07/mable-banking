import { ICsvRowMapper } from '../interfaces/ICsvRowMapper';
import { TransferCsvRow } from '../types/CsvRows';

export class TransferCsvRowMapper implements ICsvRowMapper<TransferCsvRow> {
  map(values: string[]): TransferCsvRow {
    return {
      fromAccountNumber: values[0] ?? '',
      toAccountNumber: values[1] ?? '',
      amount: parseFloat(values[2] ?? '')
    };
  }
}
