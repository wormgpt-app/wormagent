import express from 'express';
import compression from 'compression';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(compression());

// Serve static files
app.use(express.static('public', { extensions: ['html'] }));
app.use(express.static('dist', { extensions: ['html'] }));

// Handle clean URLs: /docs -> /docs.html, /console/models -> /console/models.html
app.get('*', (req, res) => {
  let filePath = path.join(__dirname, 'public', req.path);
  
  // If path is directory or without extension, try .html
  if (!path.extname(req.path)) {
    // Try with .html
    const htmlPath = filePath.endsWith('/') ? path.join(filePath, 'index.html') : filePath + '.html';
    if (fs.existsSync(htmlPath)) {
      return res.sendFile(htmlPath);
    }
    // Try index.html in directory
    const indexPath = path.join(filePath, 'index.html');
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
    // Try public file as is
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      return res.sendFile(filePath);
    }
  } else {
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    }
  }
  
  // Fallback to index.html for SPA routes
  const indexFallback = path.join(__dirname, 'public', 'index.html');
  if (fs.existsSync(indexFallback)) {
    return res.sendFile(indexFallback);
  }
  res.status(404).send('Not Found — WormAgent.net');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ WormAgent.net (Full opencode.ai clone) running on http://0.0.0.0:${PORT}`);
  console.log(`📁 Serving ${fs.readdirSync(path.join(__dirname, 'public')).length} files from public/`);
});
