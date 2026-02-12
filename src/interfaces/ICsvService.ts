import { IValidator } from './IValidator';
import { ICsvRowMapper } from './ICsvRowMapper';

export interface ICsvService {
  load<T>(
    filePath: string, 
    validator: IValidator, 
    mapper: ICsvRowMapper<T>
  ): Promise<T[]>;
  write(filePath: string, records: string[][]): Promise<void>;
}
