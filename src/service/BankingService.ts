import { ICsvService } from "../interfaces/ICsvService";
import { CsvService } from "./CsvService";
import { AccountValidator } from "../validators/AccountValidator";
import { TransferValidator } from "../validators/TransferValidator";
import { IAccountsService } from "../interfaces/IAccountsService";
import { AccountsService } from "./AccountsService";
import { ITransferService } from "../interfaces/ITransferService";
import { TransferService } from "./TransferService";
import { AccountCsvRow, TransferCsvRow } from "../types/CsvRows";
import { AccountCsvRowMapper } from "../mapper/AccountCsvRowMapper";
import { TransferCsvRowMapper } from "../mapper/TransferCsvRowMapper";
import { ReportingService } from "./ReportingService";

export class BankingService {
  private csvService: ICsvService;
  private reportingService: ReportingService;

  constructor() {
    this.csvService = new CsvService();
    this.reportingService = new ReportingService(this.csvService);
  }

  async run(
    accountsFile: string,
    transfersFile: string,
    outputFile: string,
    logFile: string,
  ): Promise<void> {
    // Load and initialize
    const accountRecords = await this.loadAccountRecords(accountsFile);
    const transferRecords = await this.loadTransferRecords(transfersFile);

    const accountsService: IAccountsService = new AccountsService(
      accountRecords,
    );
    const transferService: ITransferService = new TransferService(
      transferRecords,
    );

    // Process transfers
    console.log("\n🔄 Processing transfers...");
    transferService.processTransfers(accountsService);

    // Report and write output
    const successCount = transferService.getSuccessCount();
    const failureCount = transferService.getFailureCount();

    this.reportingService.displaySummary(successCount, failureCount);

    await this.reportingService.writeAccountBalances(
      outputFile,
      accountsService.exportAccounts(),
    );

    await this.reportingService.writeFailureLogs(
      logFile,
      transferService.exportFailureLogs(),
    );

    this.reportingService.displayComplete();
  }

  private async loadAccountRecords(filePath: string): Promise<AccountCsvRow[]> {
    console.log("📂 Loading accounts...");
    return await this.csvService.load(
      filePath,
      new AccountValidator(),
      new AccountCsvRowMapper(),
    );
  }

  private async loadTransferRecords(
    filePath: string,
  ): Promise<TransferCsvRow[]> {
    console.log("📂 Loading transfers...");
    return await this.csvService.load(
      filePath,
      new TransferValidator(),
      new TransferCsvRowMapper(),
    );
  }
}
