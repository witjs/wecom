import { createRequire } from 'node:module';
import { access } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const files = [
  'dist/index.mjs',
  'dist/index.cjs',
  'dist/index.d.mts',
  'dist/index.d.cts',
];

for (const file of files) {
  await access(resolve(root, file));
}

const esm = await import(pathToFileURL(resolve(root, 'dist/index.mjs')).href);
const require = createRequire(import.meta.url);
const cjs = require(resolve(root, 'dist/index.cjs'));

for (const mod of [esm, cjs]) {
  for (const name of [
    'Wecom',
    'User',
    'Department',
    'Tag',
    'Agent',
    'AgentMenu',
    'Message',
    'Media',
    'Checkin',
    'Batch',
    'AppChat',
    'Approval',
    'Dial',
    'ExternalContact',
    'Calendar',
    'Schedule',
    'MeetingRoom',
    'Invoice',
    'WecomError',
    'WecomApiError',
  ]) {
    if (typeof mod[name] !== 'function') {
      throw new Error(`Missing export ${name}`);
    }
  }
}

console.log('smoke: esm/cjs/dts entries ok');
