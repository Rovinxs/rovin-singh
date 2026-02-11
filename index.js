const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';
const DIST = path.join(__dirname, 'dist');

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
  '.webp': 'image/webp',
};

// Format timestamp: YYYY-MM-DD HH:mm:ss
function formatDate(date) {
  const pad = (n) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
         `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

const server = http.createServer((req, res) => {
  const start = Date.now();

  // Get real client IP behind Traefik
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded ? forwarded.split(',')[0].trim() : req.socket.remoteAddress;

  // Clean URL (strip query string)
  let urlPath = req.url.split('?')[0];

  // Resolve file path
  let filePath = path.join(DIST, urlPath);

  // If it's root or no extension, try index.html or append .html
  if (urlPath === '/' || urlPath === '') {
    filePath = path.join(DIST, 'index.html');
    } else if (!path.extname(filePath)) {
    filePath = filePath + '.html';
  }

  const ext = path.extname(filePath);
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  // Log after response completes
  res.on('finish', () => {
    const duration = Date.now() - start;
    const timestamp = formatDate(new Date());
    console.log(`[${timestamp}] INFO "${req.method} ${req.url}" ${res.statusCode} ${duration}ms - ${ip}`);
  });

  fs.readFile(filePath, (err, data) => {
    if (err) {
      fs.readFile(path.join(DIST, '404.html'), (err404, data404) => {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(err404 ? 'Not found' : data404);
      });
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

// Start server
server.listen(PORT, HOST, () => {
  const primaryDomain = process.env.PRIMARY_DOMAIN;
  const publicUrl = primaryDomain ? `https://${primaryDomain}` : `http://localhost:${PORT}`;
  console.log('--------------------------------------------------');
  console.log('✅ Application Started');
  console.log(`🌍 Public URL: ${publicUrl}`);
  console.log(`📦 Environment: production`);
  console.log('--------------------------------------------------');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated.');
    process.exit(0);
  });
});