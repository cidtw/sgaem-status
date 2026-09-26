const http = require('http');
const net = require('net');

module.exports = async function handler(req, res) {
  // CORS & No-Cache
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const targetIp = '163.239.88.115';
  const targetPort = 3536;
  const targetHost = 'sgaemarchive.sogang.ac.kr';
  const targetUrl = `http://${targetIp}:${targetPort}/`;

  const results = {
    target: {
      ip: targetIp,
      port: targetPort,
      hostname: targetHost,
      url: targetUrl
    },
    checkedAt: new Date().toISOString(),
    status: 'offline',
    tcp: {
      connected: false,
      latencyMs: null,
      error: null
    },
    http: {
      statusCode: null,
      statusText: null,
      latencyMs: null,
      error: null
    },
    diagnostics: ''
  };

  // Run TCP Socket test (2500ms timeout)
  const testTcp = () => {
    return new Promise((resolve) => {
      const start = Date.now();
      const socket = new net.Socket();
      socket.setTimeout(2500);

      socket.on('connect', () => {
        const latency = Date.now() - start;
        socket.destroy();
        resolve({ connected: true, latencyMs: latency, error: null });
      });

      socket.on('timeout', () => {
        socket.destroy();
        resolve({ connected: false, latencyMs: null, error: 'Connection timed out (2500ms)' });
      });

      socket.on('error', (err) => {
        socket.destroy();
        resolve({ connected: false, latencyMs: null, error: err.code || err.message });
      });

      socket.connect(targetPort, targetIp);
    });
  };

  // Run HTTP request test (3000ms timeout)
  const testHttp = () => {
    return new Promise((resolve) => {
      const start = Date.now();
      const options = {
        hostname: targetIp,
        port: targetPort,
        path: '/',
        method: 'GET',
        timeout: 3000,
        headers: {
          'User-Agent': 'SGAEM-Status-Monitor/1.0',
          'Host': `${targetHost}:${targetPort}`
        }
      };

      const request = http.request(options, (response) => {
        const latency = Date.now() - start;
        resolve({
          statusCode: response.statusCode,
          statusText: response.statusMessage || `${response.statusCode}`,
          latencyMs: latency,
          error: null
        });
      });

      request.on('timeout', () => {
        request.destroy();
        resolve({
          statusCode: null,
          statusText: null,
          latencyMs: null,
          error: 'HTTP request timed out (3000ms)'
        });
      });

      request.on('error', (err) => {
        resolve({
          statusCode: null,
          statusText: null,
          latencyMs: null,
          error: err.code || err.message
        });
      });

      request.end();
    });
  };

  try {
    const [tcpResult, httpResult] = await Promise.all([testTcp(), testHttp()]);
    results.tcp = tcpResult;
    results.http = httpResult;

    if (httpResult.statusCode && httpResult.statusCode < 500) {
      results.status = 'online';
      results.diagnostics = 'Target endpoint is reachable and responding to HTTP requests.';
    } else if (tcpResult.connected) {
      results.status = 'degraded';
      results.diagnostics = `Port ${targetPort} is open, but HTTP returned ${httpResult.statusCode || httpResult.error}.`;
    } else {
      results.status = 'offline';
      results.diagnostics = 'Endpoint unreachable. Packets dropped or blocked by firewall (e.g. Sogang campus network / VPN requirement).';
    }

    res.status(200).json(results);
  } catch (error) {
    results.status = 'error';
    results.diagnostics = error.message;
    res.status(500).json(results);
  }
};
