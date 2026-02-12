import { ICsvService } from "../interfaces/ICsvService";
import { CsvService } from "./CsvService";
import { AccountValidator } from "../validators/AccountValidator";
import { TransferValidator } from "../validators/TransferValidator";
import { IAccountsService } from "../interfaces/IAccountsService";
import { AccountsService } from "./AccountsService";
import { ITransferService } from "../interfaces/ITransferService";
import { TransferService } from "./TransferService";
import { ICsvRowMapper } from "../interfaces/ICsvRowMapper";
import { AccountCsvRow, TransferCsvRow } from "../types/CsvRows";
import { AccountCsvRowMapper } from "../mapper/AccountCsvRowMapper";
import { TransferCsvRowMapper } from "../mapper/TransferCsvRowMapper";

export class BankingService {
  private csvService: ICsvService;

  constructor() {
    this.csvService = new CsvService();
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

    console.log(`✅ Success: ${successCount} | ❌ Failed: ${failureCount}`);

    await this.csvService.write(outputFile, accountsService.exportAccounts());
    
    if (failureCount > 0) {
      await this.csvService.write(logFile, transferService.exportFailureLogs());
    }

    console.log("✅ Complete!\n");
  }

  private async loadAccountRecords(filePath: string): Promise<AccountCsvRow[]> {
    console.log("📂 Loading accounts...");
    return await this.csvService.load(filePath, new AccountValidator(), new AccountCsvRowMapper());
  }

  private async loadTransferRecords(filePath: string): Promise<TransferCsvRow[]> {
    console.log("📂 Loading transfers...");
    return await this.csvService.load(filePath, new TransferValidator(), new TransferCsvRowMapper());
  }
}
