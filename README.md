# Quella Chatbot QA Monitor

Automated Playwright test suite for monitoring the Wishque Quella Chatbot (`https://wishqueuat.fexcon.com.au/`).

This suite tests multi-question chatbot conversations, monitors response times, detects freeze states, and logs test results to CSV and Playwright reports.

---

## Key Features

- **Page Object Model (POM)**: Standard Playwright class structure for locators and page interactions.
- **Fail-Fast Policy**: Halts the test immediately if the initial question fails, skipping subsequent questions.
- **Screenshot Evidence**: Saves full-page screenshots when a failure or freeze occurs.
- **CSV Logging**: Records timestamp, status, duration, error messages, and screenshot paths in `reports/quella_incidents_log.csv`.
- **Scheduled Monitoring**: Script to run checks automatically at regular intervals.

---

## Test Execution & Failure Flow

```
+-------------------------------------+
| 1. Open Website & Launch Chat       |
+------------------+------------------+
                   |
+------------------v------------------+
| 2. Ask Question 1 ("Where is my..") |
+------------------+------------------+
                   |
+------------------v------------------+
|    Wait for Quella Response 1       |
+---------+-----------------+---------+
          |                 |
[Success] |                 | [Failure / Timeout]
          v                 v
+───────────────────+     +───────────────────────────────────+
| 3. Ask Question 2 |     | Execution stops immediately       |
|    ("Is same..")  |     | Question 2 is skipped             |
+─────────┬─────────+     | Captures full-page screenshot     |
          |               | Logs failure details to CSV       |
+─────────v─────────+     | Fails test run                    |
| Wait for Response |     +───────────────────────────────────+
+─────────┬─────────+
          |
+─────────v─────────+
| Log Success to CSV|
+───────────────────+
```

### Failure Behavior
If **Question 1** fails or times out:
1. Execution stops immediately. Question 2 is skipped.
2. A screenshot is saved to `reports/screenshots/`.
3. The failure is recorded in `reports/quella_incidents_log.csv`.
4. The test fails to alert the team.

---

## Project Structure

```
Quella/
├── reports/                        # Output reports and screenshots
│   ├── quella_incidents_log.csv    # CSV log file
│   ├── screenshots/                # Failure screenshots
│   └── html-report/                # Playwright HTML report
├── src/
│   ├── pages/                      # Page Object Model classes
│   │   └── QuellaPage.ts
│   ├── tests/                      # Test specifications
│   │   └── quella-monitor.spec.ts
│   └── utils/                      # Helper utilities
│       └── logger.ts
├── scripts/                        # Scheduler scripts
│   └── run-scheduler.js
├── playwright.config.ts            # Playwright setup
└── package.json
```

---

## Quick Start

### 1. Install Dependencies
```bash
npm install
npx playwright install chromium
```

### 2. Run Headless Tests
```bash
npm test
```

### 3. Run Headed (Visible Browser)
```bash
npm run test:headed
```

### 4. Debug Mode
```bash
npm run test:debug
```

### 5. Continuous Monitoring
Run the automated monitor every 10 minutes:
```bash
npm run monitor
```

---

## Reports & Logs

### CSV Incident Log (`reports/quella_incidents_log.csv`)
Logged columns: `Timestamp`, `Status`, `ResponseTime_Sec`, `ErrorMessage`, `ScreenshotPath`.

### View HTML Report
```bash
npm run report:html
```
