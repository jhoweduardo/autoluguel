import { spawn, spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { createServer } from 'node:net';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';

// Owns only this run's container and directly spawned host, never Compose resources.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const name = `autoluguel-b01-qa-${randomUUID().replaceAll('-', '').slice(0, 12)}`;
const password = randomUUID();
let host;
let cleaning = false;
let containerCreated = false;
const docker = (args, options = {}) => {
  const result = spawnSync('docker', args, { encoding: 'utf8', timeout: 30_000, ...options });
  if (result.error || result.status !== 0) throw new Error(`Docker ${args[0]} failed (${result.status ?? 'no exit'}).`);
  return result.stdout.trim();
};
const freePort = () => new Promise((accept, reject) => {
  const server = createServer();
  server.once('error', reject);
  server.listen(0, '127.0.0.1', () => {
    const { port } = server.address();
    server.close(error => error ? reject(error) : accept(port));
  });
});
const cleanup = () => {
  if (cleaning) return;
  cleaning = true;
  host?.kill();
  if (containerCreated) {
    docker(['rm', '--force', name]);
    containerCreated = false;
    console.log(`Removed exclusive container ${name}.`);
  }
};
for (const [signal, exitCode] of [['SIGINT', 130], ['SIGTERM', 143]]) {
  process.once(signal, () => {
    try { cleanup(); } catch (error) { console.error(error.message); }
    process.exit(exitCode);
  });
}
try {
  docker(['info', '--format', '{{.ServerVersion}}']);
  // CI/local both pull explicitly; bounded separately to avoid a hung daemon.
  docker(['image', 'inspect', 'postgres:17-alpine']);
  docker(['run', '--detach', '--name', name, '--label', `autoluguel.qa=${name}`,
    '--publish', '127.0.0.1::5432', '--env', 'POSTGRES_PASSWORD',
    '--env', 'POSTGRES_USER=b01qa', '--env', 'POSTGRES_DB=b01qa',
    '--tmpfs', '/var/lib/postgresql/data', 'postgres:17-alpine'],
  { env: { ...process.env, POSTGRES_PASSWORD: password } });
  containerCreated = true;
  const mapping = docker(['port', name, '5432/tcp']);
  const databasePort = Number(mapping.match(/^127\.0\.0\.1:(\d+)$/)?.[1]);
  if (!databasePort) throw new Error('Expected an exclusive loopback PostgreSQL port.');
  const until = Date.now() + 60_000;
  while (true) {
    const ready = spawnSync('docker', ['exec', name, 'pg_isready', '-U', 'b01qa', '-d', 'b01qa'],
      { stdio: 'ignore', timeout: 5000 });
    if (ready.status === 0) break;
    if (Date.now() >= until) throw new Error('Required PostgreSQL did not become ready.');
    await delay(500);
  }
  const port = await freePort();
  host = spawn('dotnet', [join(root, 'src/Autoluguel.Api/bin/Release/net10.0/Autoluguel.Api.dll')], {
    cwd: root, stdio: 'ignore', env: { ...process.env,
      ASPNETCORE_URLS: `http://127.0.0.1:${port}`, ASPNETCORE_ENVIRONMENT: 'Development',
      ConnectionStrings__Autoluguel: `Host=127.0.0.1;Port=${databasePort};Database=b01qa;Username=b01qa;Password=${password};Timeout=2;Command Timeout=2`,
    },
  });
  host.once('error', () => { process.exitCode = 1; });
  const url = `http://127.0.0.1:${port}`;
  const deadline = Date.now() + 30_000;
  while (true) {
    try {
      const live = await fetch(`${url}/health/live`, { signal: AbortSignal.timeout(2000) });
      if (live.status === 200) break;
    } catch { /* bounded startup polling */ }
    if (host.exitCode !== null || Date.now() >= deadline) throw new Error('Required API host did not start.');
    await delay(300);
  }
  const available = await fetch(`${url}/health/ready`, { signal: AbortSignal.timeout(8000) });
  if (available.status !== 200 || (await available.json()).status !== 'ready') throw new Error('Expected readiness 200 with real PostgreSQL.');
  console.log(`PASS readiness 200; exclusive resource=${name}, database port=${databasePort}, host port=${port}.`);
  if (process.env.B01_QA_FAIL_AFTER_READY === '1') throw new Error('Controlled QA failure after readiness, testing cleanup/exit propagation.');
  if (process.env.B01_QA_WAIT_AFTER_READY === '1') await delay(60_000);
  docker(['stop', '--time', '1', name]);
  const unavailable = await fetch(`${url}/health/ready`, { signal: AbortSignal.timeout(8000) });
  if (unavailable.status !== 503 || !unavailable.headers.get('content-type')?.startsWith('application/problem+json')) {
    throw new Error('Expected readiness Problem Details 503 after stopping exclusive PostgreSQL.');
  }
  const problem = await unavailable.text();
  if (problem.includes(password) || problem.includes('Password=')) throw new Error('Readiness response leaked connection credentials.');
  console.log('PASS readiness 503 after controlled database shutdown.');
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  try { cleanup(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
