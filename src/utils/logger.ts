import * as fs from 'fs';
import * as path from 'path';

// Helper class for logging test results and managing screenshot artifacts
export class QALogger {
  private reportsFolder = path.join(process.cwd(), 'reports');
  private csvFile = path.join(this.reportsFolder, 'quella_incidents_log.csv');
  private screenshotFolder = path.join(this.reportsFolder, 'screenshots');

  constructor() {
    this.setupFolders();
  }

  // Ensure output directories and CSV header exist
  private setupFolders() {
    if (!fs.existsSync(this.screenshotFolder)) {
      fs.mkdirSync(this.screenshotFolder, { recursive: true });
    }

    if (!fs.existsSync(this.csvFile)) {
      const header = 'Timestamp,Status,ResponseTime_Sec,ErrorMessage,ScreenshotPath\n';
      fs.writeFileSync(this.csvFile, header, 'utf-8');
    }
  }

  // Generate full path for saving screenshots
  public getScreenshotPath(filename: string): string {
    return path.join(this.screenshotFolder, filename);
  }

  // Record successful test execution in CSV
  public logSuccess(responseTimeMs: number): void {
    const timestamp = new Date().toISOString();
    const seconds = (responseTimeMs / 1000).toFixed(2);
    const row = `"${timestamp}","SUCCESS",${seconds},"None","N/A"\n`;

    fs.appendFileSync(this.csvFile, row, 'utf-8');
    console.log(`[${new Date().toLocaleString()}] SUCCESS: Quella responded in ${seconds}s`);
  }

  // Record test failure details and screenshot reference in CSV
  public logFailure(responseTimeMs: number, errorMessage: string, screenshotPath: string): void {
    const timestamp = new Date().toISOString();
    const seconds = (responseTimeMs / 1000).toFixed(2);
    const screenshotName = path.basename(screenshotPath);
    const cleanError = errorMessage.replace(/\n/g, ' ');

    const row = `"${timestamp}","QUELLA_UNRESPONSIVE",${seconds},"${cleanError}","${screenshotName}"\n`;

    fs.appendFileSync(this.csvFile, row, 'utf-8');
    console.error(`[${new Date().toLocaleString()}] FAILURE: QUELLA_UNRESPONSIVE (${seconds}s)`);
    console.error(`   Error details: ${cleanError}`);
    console.error(`   Screenshot: ${screenshotPath}`);
  }
}
