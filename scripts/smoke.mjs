import { access } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const files = ['dist/index.mjs', 'dist/index.d.mts'];

for (const file of files) {
  await access(resolve(root, file));
}

const esm = await import(pathToFileURL(resolve(root, 'dist/index.mjs')).href);

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
  if (typeof esm[name] !== 'function') {
    throw new Error(`Missing export ${name}`);
  }
}

console.log('smoke: esm/dts entries ok');
