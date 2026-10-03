// Tiny static server for local development that behaves like Vercel with "cleanUrls": true
//   /feed        -> feed.html
//   /feed.html   -> redirects to /feed
//   /index.html  -> redirects to /
// Usage: node dev-server.js [port]
const http = require('http'), fs = require('fs'), path = require('path');
const root = __dirname, port = +process.argv[2] || 5173;
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2' };

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  let p = decodeURIComponent(url.pathname);
  if (p.endsWith('.html')) {                                   // /x.html -> /x  (index.html -> /)
    const clean = p === '/index.html' ? '/' : p.slice(0, -5);
    res.writeHead(308, { Location: clean + url.search }); return res.end();
  }
  let file = path.join(root, p === '/' ? 'index.html' : p);
  if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    const html = file.replace(/\/$/, '') + '.html';
    if (fs.existsSync(html)) file = html; else { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); return res.end('404 Not Found'); }
  }
  res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
  fs.createReadStream(file).pipe(res);
}).listen(port, () => console.log('Khamari Bazar dev server: http://localhost:' + port));
