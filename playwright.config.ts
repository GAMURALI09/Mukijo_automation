import playwrightTest = require('@playwright/test');
const { defineConfig } = playwrightTest;

export = defineConfig({
  // Output directory for files created during test execution (traces, videos, screenshots)
  outputDir: 'test_artifacts/test-results',

  // Reporters to use (HTML report will go inside test_artifacts as well)
  reporter: [
    ['html', { outputFolder: 'test_artifacts/html-report', open: 'never' }],
    ['list']
  ],

  use: {
    // Capture logs and traces for all tests (useful for debugging)
    trace: 'on',
    // Optionally capture screenshots on failure
    screenshot: 'only-on-failure'
  }
});
