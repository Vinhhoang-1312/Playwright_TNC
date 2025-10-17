const fs = require("fs-extra");

fs.removeSync("playwright-report");
fs.removeSync("test-results");
fs.removeSync("reports/allure-results");
