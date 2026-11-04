import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const validator = join(root, 'tools/ci/validate-openapi.mjs');
const temporaryCase = action => {
  const folder = mkdtempSync(join(tmpdir(), 'autoluguel-gate-'));
  try { return action(folder); } finally { rmSync(folder, { recursive: true, force: true }); }
};
test('OpenAPI gate rejects structurally invalid contract', () => temporaryCase(folder => {
  const path = join(folder, 'invalid.json');
  writeFileSync(path, JSON.stringify({ openapi: '3.0.3', info: { title: 'Synthetic', version: '1' }, paths: [] }));
  const result = spawnSync(process.execPath, [validator, path], { encoding: 'utf8', timeout: 30_000 });
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stderr, /OpenAPI validation failed/);
}));
test('OpenAPI gate rejects missing local references', () => temporaryCase(folder => {
  const path = join(folder, 'reference.json');
  writeFileSync(path, JSON.stringify({ openapi: '3.0.3', info: { title: 'Synthetic', version: '1' },
    paths: {}, components: { schemas: { Missing: { $ref: './does-not-exist.json' } } } }));
  const result = spawnSync(process.execPath, [validator, path], { encoding: 'utf8', timeout: 30_000 });
  assert.equal(result.status, 1, result.stdout + result.stderr);
}));
test('npm ci rejects a manifest incompatible with its lockfile', () => temporaryCase(folder => {
  // Local-only fixture avoids mistaking unavailable registry/cache for a lockfile failure.
  for (const [path, version] of [['first', '1.0.0'], ['second', '2.0.0']]) {
    mkdirSync(join(folder, path));
    writeFileSync(join(folder, path, 'package.json'), JSON.stringify({ name: 'synthetic-package', version }));
  }
  const manifest = { name: 'synthetic-lock-check', version: '1.0.0', private: true,
    dependencies: { 'synthetic-package': 'file:first' } };
  writeFileSync(join(folder, 'package.json'), JSON.stringify(manifest));
  const locked = spawnSync('npm install --package-lock-only --offline --ignore-scripts --no-audit --no-fund',
    { cwd: folder, encoding: 'utf8', shell: true, timeout: 30_000 });
  assert.equal(locked.status, 0, locked.stdout + locked.stderr);
  manifest.dependencies['synthetic-package'] = 'file:second';
  writeFileSync(join(folder, 'package.json'), JSON.stringify(manifest));
  const result = spawnSync('npm ci --offline --ignore-scripts --no-audit --no-fund',
    { cwd: folder, encoding: 'utf8', shell: true, timeout: 30_000 });
  assert.notEqual(result.status, 0, result.stdout + result.stderr);
  assert.equal(result.error, undefined);
  assert.match(result.stderr, /EUSAGE/);
}));
test('a genuinely failing test returns a nonzero exit code', () => temporaryCase(folder => {
  const path = join(folder, 'controlled.test.mjs');
  writeFileSync(path, "import {test} from 'node:test'; import assert from 'node:assert/strict'; test('synthetic failure',()=>assert.equal(1,2));");
  const childEnvironment = { ...process.env };
  delete childEnvironment.NODE_TEST_CONTEXT;
  const result = spawnSync(process.execPath, ['--test', path], { encoding: 'utf8', timeout: 30_000, env: childEnvironment });
  assert.equal(result.status, 1);
  assert.match(result.stdout, /fail 1/);
}));
