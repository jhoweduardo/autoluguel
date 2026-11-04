import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const suite = process.argv[2];
const temporary = mkdtempSync(join(tmpdir(), 'autoluguel-suite-'));
try {
  let result;
  let total;
  let passed;
  let failed;
  let skipped;
  if (suite === 'unit') {
    result = spawnSync('dotnet', ['test', 'Autoluguel.slnx', '--configuration', 'Release', '--no-restore',
      '--logger', 'trx;LogFileName=unit.trx', '--results-directory', temporary, ...process.argv.slice(3)],
    { cwd: root, stdio: 'inherit', timeout: 180_000 });
    const reports = readdirSync(temporary).filter(file => file.endsWith('.trx'));
    if (reports.length !== 1) throw new Error('Expected exactly one unit report; update discovery when adding a suite.');
    const counters = readFileSync(join(temporary, reports[0]), 'utf8').match(/<Counters\s+([^>]+)\/>/);
    if (!counters) throw new Error('Missing unit result counters.');
    const count = name => Number(counters[1].match(new RegExp(`\\b${name}="(\\d+)"`))?.[1] ?? NaN);
    total = count('total'); passed = count('passed'); failed = count('failed');
    skipped = count('notExecuted');
  } else if (suite === 'web') {
    const report = join(temporary, 'playwright.json');
    result = spawnSync(process.execPath, [join(root, 'apps/web/node_modules/@playwright/test/cli.js'),
      'test', '--reporter=json', '--global-timeout=90000', ...process.argv.slice(3)],
    { cwd: join(root, 'apps/web'), stdio: 'inherit', timeout: 120_000,
      env: { ...process.env, CI: 'true', PLAYWRIGHT_JSON_OUTPUT_FILE: report } });
    const { stats, errors } = JSON.parse(readFileSync(report, 'utf8'));
    if (errors?.length) throw new Error('Playwright reported a global error.');
    passed = stats.expected; failed = stats.unexpected + stats.flaky; skipped = stats.skipped;
    total = passed + failed + skipped;
  } else {
    throw new Error('Usage: node tests/ci/run-suite.mjs unit|web [test arguments]');
  }
  console.log(`${suite}: total=${total}, passed=${passed}, failed=${failed}, skipped=${skipped}`);
  if (result.error || result.status !== 0 || ![total, passed, failed, skipped].every(Number.isFinite)
      || total < 1 || passed !== total || failed !== 0 || skipped !== 0) {
    throw new Error('Required suite failed, was empty, flaky, skipped, or did not terminate normally.');
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
