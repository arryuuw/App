import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const apiKey = process.env.OPENROUTER_API_KEY ||
  (process.env.CI ? undefined : spawnSync('/bin/zsh', ['-ic', 'print -rn -- "${OPENROUTER_API_KEY-}"'], { encoding: 'utf8' }).stdout?.trim() || undefined);
const env = { ...process.env, JEV_ROUTER_PROVIDER: 'openrouter', ...(apiKey ? { OPENROUTER_API_KEY: apiKey } : {}) };
const bin = here('../vendor/node_modules/jevrouter/bin/jevrouter.mjs');
const result = spawnSync(process.execPath, [bin, ...process.argv.slice(2)], { cwd: here('../../../../'), env, stdio: 'inherit' });
if (result.error) console.error('JevRouter launcher failed: ' + result.error.message);
process.exit(result.status ?? 1);
