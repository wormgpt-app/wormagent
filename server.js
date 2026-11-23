import express from 'express';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(compression());
app.use(express.static('dist'));
app.use(express.static('public'));
app.use(express.static('WormAgent/web'));
app.use(express.static('.'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'), (err) => {
    if (err) res.sendFile(path.join(__dirname, 'public', 'index.html'), (err2) => {
      if (err2) res.send(`
        <html dir="rtl" style="background:#000;color:#fff;font-family:system-ui;text-align:center;padding:4rem">
          <h1 style="color:#FF0000;font-size:3rem">WormAgent.net 🌀</h1>
          <p>WormAgent — وكيلك الشخصي</p>
          <p><a href="https://github.com/wormgpt-app/wormagent" style="color:#FF0000">GitHub: wormgpt-app/wormagent</a></p>
          <p>Hostinger Node.js ✅</p>
        </html>
      `);
    });
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ WormAgent.net running on http://0.0.0.0:${PORT}`);
});
