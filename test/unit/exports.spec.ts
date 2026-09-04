import { describe, expect, it } from 'vitest';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));

describe('package exports', () => {
  it('declares root and module subpath exports', () => {
    expect(pkg.exports['.']).toBeTruthy();
    expect(pkg.exports['./user']).toBeTruthy();
    expect(pkg.exports['./message']).toBeTruthy();
    expect(pkg.exports['./suite']).toBeTruthy();
    expect(pkg.exports['./webhook']).toBeTruthy();
    expect(pkg.exports['./client']).toBeTruthy();
    expect(pkg.exports['./package.json']).toBe('./package.json');
  });

  it('subpath export targets point at dist modules', () => {
    for (const [key, value] of Object.entries(pkg.exports)) {
      if (key === './package.json') continue;
      const target = value as { import: string; types: string };
      expect(target.import.startsWith('./dist/')).toBe(true);
      expect(target.types.startsWith('./dist/')).toBe(true);
    }
  });
});

describe('public import shapes', () => {
  it('root barrel exposes createClient and modules', async () => {
    const mod = await import('../../src/index');
    expect(typeof mod.createClient).toBe('function');
    expect(typeof mod.createScope).toBe('function');
    expect(mod.User).toBeTruthy();
    expect(mod.Message).toBeTruthy();
    expect(mod.WecomModule).toBeTruthy();
  });

  it('module entry files are importable from source paths', async () => {
    const user = await import('../../src/modules/user/index');
    const message = await import('../../src/modules/message/index');
    expect(user.User).toBeTruthy();
    expect(message.Message).toBeTruthy();
  });
});
