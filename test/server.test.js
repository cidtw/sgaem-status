'use strict';
const test = require('node:test');
const assert = require('node:assert');
const net = require('node:net');
const path = require('node:path');
const server = require('../server');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

test('resolvePublicPath: maps normal paths inside public/', () => {
  assert.strictEqual(server.resolvePublicPath('/'), path.join(PUBLIC_DIR, 'index.html'));
  assert.strictEqual(server.resolvePublicPath('/app.js'), path.join(PUBLIC_DIR, 'app.js'));
});

test('resolvePublicPath: rejects traversal outside public/', () => {
  for (const p of ['/../server.js', '/../../etc/passwd', '/%2e%2e/server.js', '/..%2fserver.js', '/a%00b', '/%E0%A4%A']) {
    assert.strictEqual(server.resolvePublicPath(p), null, p);
  }
});

// Send a raw request line so the client does not normalize "..".
function rawGet(port, target) {
  return new Promise((resolve, reject) => {
    const socket = net.connect(port, '127.0.0.1', () => {
      socket.write(`GET ${target} HTTP/1.1\r\nHost: localhost\r\nConnection: close\r\n\r\n`);
    });
    let data = '';
    socket.on('data', (c) => (data += c));
    socket.on('end', () => resolve(data));
    socket.on('error', reject);
  });
}

test('server: raw "../server.js" request is refused, normal file served', async () => {
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  try {
    const { port } = server.address();
    const bad = await rawGet(port, '/../server.js');
    assert.match(bad, /^HTTP\/1\.1 403/);
    assert.doesNotMatch(bad, /createServer/);
    const ok = await rawGet(port, '/index.html');
    assert.match(ok, /^HTTP\/1\.1 200/);
  } finally {
    await new Promise((r) => server.close(r));
  }
});
