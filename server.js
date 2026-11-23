import express from 'express';
import compression from 'compression';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(compression());

// Serve static assets (js, css, images, videos) — no redirect for directories, try html extension
app.use(express.static('public', { extensions: ['html'], redirect: false }));
app.use(express.static('dist', { extensions: ['html'], redirect: false }));

// Helper to try to find file for clean URL
function findFile(urlPath) {
  const base = path.join(__dirname, 'public', urlPath);
  // 1. Exact file
  if (fs.existsSync(base) && fs.statSync(base).isFile()) return base;
  // 2. Try with .html
  if (fs.existsSync(base + '.html')) return base + '.html';
  // 3. Try index.html in directory
  const indexPath = path.join(base, 'index.html');
  if (fs.existsSync(indexPath)) return indexPath;
  // 4. Try dist
  const distBase = path.join(__dirname, 'dist', urlPath);
  if (fs.existsSync(distBase) && fs.statSync(distBase).isFile()) return distBase;
  if (fs.existsSync(distBase + '.html')) return distBase + '.html';
  return null;
}

// Handle all GET requests — clean URLs
app.get('*', (req, res) => {
  // Remove query string
  let reqPath = req.path;
  // Skip if has extension and is asset — 404 if not found
  if (path.extname(reqPath)) {
    const f = findFile(reqPath);
    if (f) return res.sendFile(f);
    return res.status(404).send('Not Found — WormAgent.net');
  }
  // Try clean URL -> .html
  let file = findFile(reqPath);
  if (file) return res.sendFile(file);
  // Try with trailing slash removed/added
  if (reqPath.endsWith('/')) {
    file = findFile(reqPath.slice(0, -1));
    if (file) return res.sendFile(file);
  } else {
    file = findFile(reqPath + '/');
    if (file) return res.sendFile(file);
  }
  // Fallback to index.html for SPA-like routes (e.g., /changelog/v2.3.0 -> index)
  // But for docs/* we want docs.html, for console/* we want console.html
  // Check parent: /docs/cli -> try /docs.html
  const parts = reqPath.split('/').filter(Boolean);
  if (parts.length > 1) {
    const parentPath = '/' + parts[0];
    file = findFile(parentPath);
    if (file && file.endsWith('.html')) {
      // For nested docs routes, serve parent docs.html if nested not found
      // Only for known sections
      const knownParents = ['docs', 'console', 'changelog', 'product', 'desktop', 'terminal', 'mobile', 'sdk', 'data', 'brand', 'legal', 'press'];
      if (knownParents.includes(parts[0])) {
        return res.sendFile(file);
      }
    }
  }
  // Final fallback: index.html
  const indexFallback = path.join(__dirname, 'public', 'index.html');
  if (fs.existsSync(indexFallback)) return res.sendFile(indexFallback);
  res.status(404).send('Not Found — WormAgent.net');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ WormAgent.net (33M, 261 files) running on http://0.0.0.0:${PORT}`);
});
