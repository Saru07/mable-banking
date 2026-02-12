import { ICsvService } from "../interfaces/ICsvService";

export class ReportingService {
  constructor(private csvService: ICsvService) {}

  displaySummary(successCount: number, failureCount: number): void {
    console.log(`✅ Success: ${successCount} | ❌ Failed: ${failureCount}`);
  }

  displayComplete(): void {
    console.log("✅ Complete!\n");
  }

  async writeAccountBalances(
    filePath: string, 
    accountData: string[][]
  ): Promise<void> {
    await this.csvService.write(filePath, accountData);
  }

  async writeFailureLogs(
    filePath: string, 
    failureData: string[][]
  ): Promise<void> {
    if (failureData.length > 0) {
      await this.csvService.write(filePath, failureData);
    }
  }
}
