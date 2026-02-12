import * as fs from "fs";
import * as readline from "readline";
import * as path from "path";
import { IValidator } from "../interfaces/IValidator";
import { ICsvService } from "../interfaces/ICsvService";
import { ICsvRowMapper } from "../interfaces/ICsvRowMapper";

export class CsvService implements ICsvService {
  /**
   * Load and validate CSV file
   * Returns array of validated records (string arrays)
   */
  async load<T>(
    filePath: string,
    validator: IValidator,
    mapper: ICsvRowMapper<T>,
  ): Promise<T[]> {
    const records: T[] = [];
    const lines = await this.readLines(filePath);

    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      const record = line.split(",").map((field) => field.trim());
      const result = validator.validate(record);

      if (result.state === "failure") {
        throw new Error(`Line ${lineNumber}: ${result.errorMessage}`);
      }
      const typedRow = mapper.map(record);
      records.push(typedRow);
    });

    console.log(`✅ Loaded ${records.length} records from ${filePath}`);
    return records;
  }

  /**
   * Write records to CSV file
   */
  async write(filePath: string, records: string[][]): Promise<void> {
    if (records.length === 0) {
      return; 
    }
    const lines = records.map((record) => record.join(","));

    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, lines.join("\n"), "utf-8");
    console.log(`✅ Written ${records.length} records to ${filePath}`);
  }

  /**
   * Read all non-empty lines from file
   */
  private async readLines(filePath: string): Promise<string[]> {
    const lines: string[] = [];

    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      const trimmed = line.trim();
      if (trimmed) {
        lines.push(trimmed);
      }
    }

    return lines;
  }
}
