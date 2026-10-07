const http = require('http');
const fs = require('fs');
const path = require('path');
const statusHandler = require('./api/status');

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'text/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon'
};

const PUBLIC_DIR = path.join(__dirname, 'public');

// Map a URL pathname to a file inside public/. Returns null for anything that
// would escape public/ (e.g. "/../server.js", encoded "..", NUL bytes).
function resolvePublicPath(pathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return null;
  }
  if (decoded.includes('\0')) return null;
  const cleanPath = decoded === '/' ? 'index.html' : decoded.replace(/^\/+/, '');
  const filePath = path.resolve(PUBLIC_DIR, cleanPath);
  if (filePath !== PUBLIC_DIR && !filePath.startsWith(PUBLIC_DIR + path.sep)) return null;
  return filePath;
}

const server = http.createServer((req, res) => {
  const reqUrl = req.url || '/';
  const pathname = reqUrl.split('?')[0];

  // Route API
  if (pathname === '/api/status' || pathname.startsWith('/api/status')) {
    res.status = (code) => {
      res.statusCode = code;
      return res;
    };
    res.json = (data) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data, null, 2));
    };

    return statusHandler(req, res);
  }

  // Serve static files (confined to public/)
  const filePath = resolvePublicPath(pathname);
  if (filePath === null) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('403 Forbidden');
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    return fs.createReadStream(filePath).pipe(res);
  }

  // Fallback to index.html for SPA
  const indexPath = path.join(PUBLIC_DIR, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
    return fs.createReadStream(indexPath).pipe(res);
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('404 Not Found');
});

// Remove local-server.js if it exists
if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

module.exports = server;
module.exports.resolvePublicPath = resolvePublicPath;
