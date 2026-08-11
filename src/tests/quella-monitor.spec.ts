import { test } from '@playwright/test';
import { QuellaPage } from '../pages/QuellaPage';
import { QALogger } from '../utils/logger';

const logger = new QALogger();

test.describe('Quella Chatbot Monitor', () => {

  test('Verify multi-question conversation in same chat', async ({ page }) => {
    const quella = new QuellaPage(page);
    const start = Date.now();

    try {
      await quella.gotoWebsite();
      await quella.openChat();

      // First question check
      await quella.askQuestion('Where is my order?');
      await quella.waitForAnswer('order');

      // Second question check in same chat window
      await quella.askQuestion('Is same-day delivery available?');
      await quella.waitForAnswer('same-day delivery');

      logger.logSuccess(Date.now() - start);

    } catch (error: any) {
      // On failure or freeze, capture screenshot and log to CSV
      const responseTime = Date.now() - start;
      const screenshot = logger.getScreenshotPath(`freeze_chat_${Date.now()}.png`);

      if (!page.isClosed()) {
        await page.screenshot({ path: screenshot, fullPage: true }).catch(() => { });
      }

      logger.logFailure(responseTime, error.message, screenshot);
      throw error;
    }
  });

});
