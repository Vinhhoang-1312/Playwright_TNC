const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const reportDir = path.join(repoRoot, "allure-report");
const resultsDir = path.join(repoRoot, "reports", "allure-results");
const historySrc = path.join(reportDir, "history");
const historyDest = path.join(resultsDir, "history");

function copyFolderSync(from, to) {
  if (!fs.existsSync(from)) return false;
  if (!fs.existsSync(to)) fs.mkdirSync(to, { recursive: true });
  const items = fs.readdirSync(from);
  for (const item of items) {
    const src = path.join(from, item);
    const dst = path.join(to, item);
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
      copyFolderSync(src, dst);
    } else {
      fs.copyFileSync(src, dst);
    }
  }
  return true;
}

try {
  if (!fs.existsSync(resultsDir)) {
    console.log("[preallure] reports/allure-results does not exist, creating");
    fs.mkdirSync(resultsDir, { recursive: true });
  }

  if (copyFolderSync(historySrc, historyDest)) {
    console.log(
      "[preallure] copied history from allure-report to reports/allure-results/history"
    );
  } else {
    console.log(
      "[preallure] no existing allure-report/history to copy (first run?)"
    );
  }
} catch (e) {
  console.error("[preallure] error:", e && e.message ? e.message : e);
  process.exit(1);
}
