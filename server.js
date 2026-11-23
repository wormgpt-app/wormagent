import express from 'express';
import compression from 'compression';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(compression());

// Serve install scripts with correct content-type BEFORE static
app.get(['/install', '/v1/install', '/v2/install'], (req, res) => {
  let filePath;
  if (req.path === '/install') filePath = path.join(__dirname, 'public', 'install');
  else if (req.path === '/v1/install') filePath = path.join(__dirname, 'public', 'v1', 'install');
  else filePath = path.join(__dirname, 'public', 'v2', 'install');
  if (fs.existsSync(filePath)) {
    res.type('text/plain; charset=utf-8');
    res.set('Cache-Control', 'no-store');
    return res.sendFile(filePath);
  }
  res.status(404).send('Not Found');
});

// Serve static assets — no redirect, try html extension
app.use(express.static('public', { extensions: ['html'], redirect: false }));
app.use(express.static('dist', { extensions: ['html'], redirect: false }));

function findFile(urlPath) {
  const base = path.join(__dirname, 'public', urlPath);
  if (fs.existsSync(base) && fs.statSync(base).isFile()) return base;
  if (fs.existsSync(base + '.html')) return base + '.html';
  const indexPath = path.join(base, 'index.html');
  if (fs.existsSync(indexPath)) return indexPath;
  const distBase = path.join(__dirname, 'dist', urlPath);
  if (fs.existsSync(distBase) && fs.statSync(distBase).isFile()) return distBase;
  if (fs.existsSync(distBase + '.html')) return distBase + '.html';
  return null;
}

app.get('*', (req, res) => {
  let reqPath = req.path;
  // If has extension and is asset — 404 if not found (don't fallback)
  if (path.extname(reqPath)) {
    const f = findFile(reqPath);
    if (f) return res.sendFile(f);
    return res.status(404).send('Not Found — WormAgent.net');
  }
  let file = findFile(reqPath);
  if (file) return res.sendFile(file);
  if (reqPath.endsWith('/')) {
    file = findFile(reqPath.slice(0, -1));
    if (file) return res.sendFile(file);
  } else {
    file = findFile(reqPath + '/');
    if (file) return res.sendFile(file);
  }
  const parts = reqPath.split('/').filter(Boolean);
  if (parts.length > 1) {
    const parentPath = '/' + parts[0];
    file = findFile(parentPath);
    if (file && file.endsWith('.html')) {
      const knownParents = ['docs', 'console', 'changelog', 'product', 'desktop', 'terminal', 'mobile', 'sdk', 'data', 'brand', 'legal', 'press'];
      if (knownParents.includes(parts[0])) return res.sendFile(file);
    }
  }
  const indexFallback = path.join(__dirname, 'public', 'index.html');
  if (fs.existsSync(indexFallback)) return res.sendFile(indexFallback);
  res.status(404).send('Not Found — WormAgent.net');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ WormAgent.net (33M, 261 files + install) running on http://0.0.0.0:${PORT}`);
});
