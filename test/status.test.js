'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { getTarget, classifyStatus, DEFAULT_TARGET } = require('../api/status');

test('getTarget: defaults when env is empty', () => {
  assert.deepStrictEqual(getTarget({}), DEFAULT_TARGET);
});

test('getTarget: env overrides, invalid port falls back to default', () => {
  const t = getTarget({ STATUS_TARGET_IP: '10.0.0.1', STATUS_TARGET_PORT: '8080', STATUS_TARGET_HOSTNAME: 'example.test' });
  assert.deepStrictEqual(t, { ip: '10.0.0.1', port: 8080, hostname: 'example.test' });
  assert.strictEqual(getTarget({ STATUS_TARGET_PORT: 'abc' }).port, DEFAULT_TARGET.port);
  assert.strictEqual(getTarget({ STATUS_TARGET_PORT: '70000' }).port, DEFAULT_TARGET.port);
});

test('classifyStatus: online when HTTP responds below 500', () => {
  assert.strictEqual(classifyStatus({ connected: true }, { statusCode: 200 }, 3536).status, 'online');
  assert.strictEqual(classifyStatus({ connected: false }, { statusCode: 404 }, 3536).status, 'online');
});

test('classifyStatus: degraded when TCP is open but HTTP fails or 5xx', () => {
  const r = classifyStatus({ connected: true }, { statusCode: 502 }, 3536);
  assert.strictEqual(r.status, 'degraded');
  assert.match(r.diagnostics, /Port 3536 is open, but HTTP returned 502/);
  const r2 = classifyStatus({ connected: true }, { statusCode: null, error: 'ECONNRESET' }, 3536);
  assert.match(r2.diagnostics, /ECONNRESET/);
});

test('classifyStatus: offline when nothing answers', () => {
  assert.strictEqual(classifyStatus({ connected: false }, { statusCode: null, error: 'ETIMEDOUT' }, 3536).status, 'offline');
});
