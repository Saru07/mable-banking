import * as fs from "fs";
import * as readline from "readline";
import * as path from "path";
import { IValidator } from "../interfaces/IValidator";
import { ICsvService } from "../interfaces/ICsvService";

export class CsvService implements ICsvService {
  /**
   * Load and validate CSV file
   * Returns array of validated records (string arrays)
   */
  async load(filePath: string, validator: IValidator): Promise<string[][]> {
    const records: string[][] = [];
    const lines = await this.readLines(filePath);

    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      const record = line.split(",").map((field) => field.trim());

      validator.validate(record, lineNumber);
      records.push(record);
    });

    console.log(`✅ Loaded ${records.length} records from ${filePath}`);
    return records;
  }

  /**
   * Write records to CSV file
   */
  async write(filePath: string, records: string[][]): Promise<void> {
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
