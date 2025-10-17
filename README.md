# Playwright Automation Project — Summary & Structure

This repository contains a Playwright-based end-to-end test suite organized for clarity, maintainability, and parallel execution. The project uses the Page Object Model (POM), centralized configuration, data-driven tests (Excel/JSON), and Allure reporting.

## Quick start

1. Install dependencies:

```powershell
npm ci
```

2. Run tests (local):

```powershell
npx playwright test
```

3. Run tests for a specific spec:

```powershell
npx playwright test tests/web/login.spec.ts
```

4. Generate Allure HTML report (after tests produce results):

```powershell
npm run allure:report
```

## Canonical repository structure

- `tests/` — test suites
  - `tests/web/` — web UI tests (canonical files; demo/test scratch files are archived or removed)
    - `login.spec.ts` — canonical, data-driven login tests
- `pages/` — Page Object classes (POM)
- `utils/` — helper modules (data providers, Excel helpers, logger, Allure helpers)
- `data/` — test data files (Excel, JSON). Canonical data file: `data/users.xlsx` or `data/users.json`.
- `config/` — environment-specific configs (dev/stage/prod)
- `ci/` — CI helper scripts (archive/cleanup helpers)
- `reports/` — test artifacts and Allure results (single canonical place for artifacts)
  - `reports/allure-results` — Allure raw JSON + attachments
  - `reports/allure-report` — generated HTML report (output of `allure generate`)
- `archive/` — backup/old artifacts and removed demo files (reversible)
- `scripts/` — utility scripts used for maintenance (move/cleanup, comment removal backups)

## Why single canonical test file

To avoid duplicate runs, keep one canonical test per feature (e.g., login). Experimental/demo files were archived. This keeps CI fast and reports clean.

## Data-driven parallel execution (how it works)

- Each data row is turned into a separate `test(...)`. Playwright will distribute tests across workers (`--workers` flag). Example pattern is used in `tests/web/login.spec.ts`.
- To scale beyond a single machine, split the dataset into chunks and run parallel CI jobs (sharding). I can add an example GitHub Actions matrix for this on request.

## Artifacts & Allure

- Reporter configured to write into `reports/allure-results` (centralized). Use `npm run allure:report` to generate the HTML report into `reports/allure-report`.
- CI workflows should upload `reports/allure-results` as an artifact so that the report can be generated or archived by a separate job.

## Backups & undos

- I moved old/duplicate files into `archive/` (e.g., `archive/tests` and backups of files before comment removal under `archive/comments_backup_strict`). If you want to restore any file, copy it back from `archive`.

## Recommended next steps

1. Add a GitHub Actions workflow to run tests and upload `reports/allure-results` (I can create this for you).
2. Add ESLint + Prettier for consistent code style.
3. Add small unit tests for `utils/` helpers (Excel parsing, data provider) and run them in CI.

## Contact

If you want me to: create the CI workflow, implement dataset sharding, or restore any archived demo files, tell me which and I'll implement it.
