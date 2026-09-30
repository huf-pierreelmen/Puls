import test from 'node:test';
import assert from 'node:assert/strict';
import { readSupabaseConfig } from '../src/lib/supabase-config.ts';

test('local UI development does not require backend credentials', () => {
  assert.equal(readSupabaseConfig().status, 'missing');
  assert.equal(readSupabaseConfig('https://example.supabase.co', ' ').status, 'missing');
});
test('accepts hosted and local Supabase URLs and trims configuration', () => {
  assert.deepEqual(readSupabaseConfig(' https://example.supabase.co ', ' sb_publishable_example '), {
    status: 'ready', url: 'https://example.supabase.co', key: 'sb_publishable_example',
  });
  assert.equal(readSupabaseConfig('http://127.0.0.1:54321', 'sb_publishable_example').status, 'ready');
});
test('reports invalid URLs and rejects non-publishable keys', () => {
  for (const url of ['invalid', 'ftp://example.com', 'https://user:pass@example.com']) {
    assert.equal(readSupabaseConfig(url, 'sb_publishable_example').status, 'invalid');
  }
  for (const key of ['sb_secret_example', 'eyJhbGciOiJIUzI1NiJ9.example', 'mistyped']) {
    assert.equal(readSupabaseConfig('https://example.supabase.co', key).status, 'invalid');
  }
});
