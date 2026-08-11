const { execSync } = require('child_process');

// Continuous monitoring interval in minutes
const INTERVAL_IN_MINUTES = 30;
const INTERVAL_IN_MS = INTERVAL_IN_MINUTES * 60 * 1000;

// Executes the Playwright test suite and logs the outcome
function runTestCheck() {
    const timeNow = new Date().toLocaleString();

    console.log('==================================================');
    console.log(`[${timeNow}] Starting Quella QA Check...`);
    console.log('==================================================');

    try {
        execSync('npx playwright test', { stdio: 'inherit' });
        console.log(`\n[${timeNow}] Check completed successfully.`);
    } catch (error) {
        console.error(`\n[${timeNow}] Incident detected. Check reports/quella_incidents_log.csv for details.`);
    }

    console.log(`\nNext check scheduled in ${INTERVAL_IN_MINUTES} minutes.`);
    console.log('--------------------------------------------------\n');
}

console.log('Quella Automated Monitor Started');

// Run first check immediately, then schedule recurring checks
runTestCheck();
setInterval(runTestCheck, INTERVAL_IN_MS);
