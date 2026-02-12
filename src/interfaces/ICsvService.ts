import { IValidator } from "./IValidator";

export interface ICsvService {
  load(filePath: string, validator: IValidator): Promise<string[][]>;
  write(filePath: string, records: string[][]): Promise<void>;
}
