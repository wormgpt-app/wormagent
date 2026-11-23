import express from 'express';
import compression from 'compression';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(compression());

// Install scripts — text/plain
app.get(['/install', '/v1/install', '/v2/install'], (req, res) => {
  let fp;
  if (req.path === '/install') fp = path.join(__dirname, 'public', 'install');
  else if (req.path === '/v1/install') fp = path.join(__dirname, 'public', 'v1', 'install');
  else fp = path.join(__dirname, 'public', 'v2', 'install');
  if (fs.existsSync(fp)) {
    res.type('text/plain; charset=utf-8');
    res.set('Cache-Control', 'no-store');
    return res.sendFile(fp);
  }
  res.status(404).send('Not Found');
});

// Static assets — no redirect
app.use(express.static('public', { redirect: false }));
app.use(express.static('dist', { redirect: false }));

// Single page — كل الطرق ترجع index.html (صفحة واحدة فقط)
app.get('*', (req, res) => {
  // إذا طلب asset موجود (css/js/png...) نخدمه
  let fp = path.join(__dirname, 'public', req.path);
  if (fs.existsSync(fp) && fs.statSync(fp).isFile()) return res.sendFile(fp);
  let distFp = path.join(__dirname, 'dist', req.path);
  if (fs.existsSync(distFp) && fs.statSync(distFp).isFile()) return res.sendFile(distFp);
  // أي شيء آخر → index.html (صفحة واحدة)
  const index = path.join(__dirname, 'public', 'index.html');
  if (fs.existsSync(index)) return res.sendFile(index);
  res.status(404).send('WormAgent.net — Single Page');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ WormAgent.net — SINGLE PAGE (88 files, 27M + install) on http://0.0.0.0:${PORT}`);
});
