import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const name = '@hufvudstaden/design-system';
const npmCli = process.env.npm_execpath;
if (!npmCli) throw new Error('Run this script through npm run.');

function npm(args, cwd = root) {
  const result = spawnSync(process.execPath, [npmCli, ...args], { cwd, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

let mode = process.argv[2];
const argument = process.argv[3];
if (mode === 'update') {
  const manifest = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  mode = manifest.dependencies?.[name]?.startsWith('file:') ? 'local' : 'registry';
}

if (mode === 'local') {
  const source = resolve(root, argument ?? '../hufvudstaden-design-system');
  const manifest = JSON.parse(readFileSync(join(source, 'package.json'), 'utf8'));
  if (manifest.name !== name) throw new Error('The source folder is not the Hufvudstaden design system.');
  const packed = mkdtempSync(join(tmpdir(), 'puls-design-system-'));
  npm(['pack', '--pack-destination', packed], source);
  const archives = readdirSync(packed).filter((file) => file.endsWith('.tgz'));
  if (archives.length !== 1) throw new Error('Expected exactly one packed archive.');
  const archive = join(packed, archives[0]);
  const hash = createHash('sha256').update(readFileSync(archive)).digest('hex').slice(0, 12);
  const filename = `hufvudstaden-design-system-${manifest.version}-${hash}.tgz`;
  mkdirSync(join(root, 'vendor'), { recursive: true });
  copyFileSync(archive, join(root, 'vendor', filename));
  // Unique content-based names ensure edits at the same package version are reinstalled.
  npm(['install', '--save-exact', `./vendor/${filename}`]);
} else if (mode === 'registry') {
  const version = argument ?? 'latest';
  if (!/^[a-zA-Z0-9][a-zA-Z0-9.+-]*$/.test(version)) throw new Error('Supply a release version or npm dist-tag.');
  npm(['install', '--save-exact', `${name}@${version}`]);
} else {
  throw new Error('Expected local, registry, or update.');
}
npm(['run', 'sync:guidance']);
console.log('Design system updated. Restart the development server.');
