import { TransferResult } from "../domain/TransferResult";
import * as fs from "fs";

export class ReportingService {
  displaySummary(results: TransferResult[]): void {
    const successCount = results.filter((r) => r.state === "success").length;
    const failureCount = results.filter((r) => r.state === "failure").length;

    console.log("");
    console.log("=== Transfer Summary ===");
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Failed: ${failureCount}`);
  }

  logFailuresToFile(results: TransferResult[], filePath: string): void {
    const failures = results.filter((r) => r.state === "failure");

    if (failures.length === 0) {
      return;
    }

    const logLines = failures.map((result, index) => {
      const { transfer, errorMessage } = result;
      return `Transfer ${index + 1}: ${transfer.fromAccount} -> ${transfer.toAccount}, Amount: ${transfer.amount} | Error: ${errorMessage}`;
    });

    fs.writeFileSync(filePath, logLines.join("\n"), "utf-8");
    console.log(`📄 Failures logged to: ${filePath}`);
  }
}
