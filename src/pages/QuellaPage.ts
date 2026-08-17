import { Page, Locator, expect } from '@playwright/test';

export class QuellaPage {
  readonly page: Page;
  readonly chatButton: Locator;
  readonly starterChip: Locator;
  readonly chatInput: Locator;
  readonly botReply: Locator;

  constructor(page: Page) {
    this.page = page;
    this.chatButton = page.locator('#fexcon-chat-button, .fexcon-chat-launcher, button:has-text("Need Help?")').first();
    this.starterChip = page.locator(':text("Where is my order?")').first();
    this.chatInput = page.locator('input[placeholder*="Type"], textarea[placeholder*="Type"], textarea').last();
    this.botReply = page.locator('.fexcon-chat-message-assistant, .fexcon-chat-reply, div[class*="assistant"]').last();
  }

  // Navigate to the Wishque UAT web application
  async gotoWebsite() {
    console.log('Opening website...');
    await this.page.goto('https://www.wishque.com/');
  }

  // Open the chat widget launcher
  async openChat() {
    console.log('Opening chat launcher...');
    await expect(this.chatButton).toBeVisible({ timeout: 30000 });
    await this.chatButton.click();
  }

  // Submit a question via chip click or text input
  async askQuestion(question: string) {
    console.log(`Asking: "${question}"`);

    const hasStarter = await this.starterChip.isVisible().catch(() => false);
    if (question === 'Where is my order?' && hasStarter) {
      await this.starterChip.click();
    } else {
      await expect(this.chatInput).toBeVisible({ timeout: 15000 });
      await expect(this.chatInput).toBeEnabled({ timeout: 15000 });
      await this.chatInput.click();
      await this.chatInput.fill(question);
      await this.chatInput.press('Enter');
    }
  }

  // Wait for bot response and verify text (case-insensitive)
  async waitForAnswer(expected: string = '', timeoutMs: number = 120000) {
    console.log('Waiting for response...');

    // 1. Wait for bot reply bubble to be visible
    await expect(this.botReply).toBeVisible({ timeout: timeoutMs });

    // 2. Wait until bot finishes thinking
    await expect(this.botReply).not.toHaveText(/^Thinking\.*/i, { timeout: timeoutMs });

    // 3. Verify text content case-insensitively if expected string provided
    if (expected) {
      const pattern = new RegExp(expected, 'i');
      await expect(this.botReply).toHaveText(pattern, { timeout: timeoutMs });
    }

    const answer = await this.botReply.innerText();
    console.log(`Quella response: "${answer.substring(0, 80).replace(/\n/g, ' ')}..."`);
    return answer;
  }
}
