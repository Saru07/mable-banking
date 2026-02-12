import { BankingService } from "./service/BankingService";

async function main(): Promise<void> {
  const args = process.argv;
  const accountsFile = args[2];
  const transfersFile = args[3];
  const outputFile = args[4] || 'output/accounts.csv';
  const logFile = args[5] || 'output/transfer-failures.log';

  if (!accountsFile || !transfersFile) {
    console.error('Usage: npm run dev <accounts.csv> <transfers.csv> [output.csv] [failures.log]');
    process.exit(1);
  }

  try {
    const bankingService = new BankingService();
    await bankingService.run(accountsFile, transfersFile, outputFile, logFile);
  } catch (error) {
    console.error('');
    console.error('❌ Error:', error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
