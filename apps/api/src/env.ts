import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { loadEnvFile } from 'node:process';
import { fileURLToPath } from 'node:url';

const moduleDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(moduleDirectory, '..', '..', '..');
const environmentFile = resolve(repositoryRoot, '.env');

if (existsSync(environmentFile)) {
  loadEnvFile(environmentFile);
}
