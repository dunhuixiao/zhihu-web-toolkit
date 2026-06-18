import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const host = '127.0.0.1';
const port = Number(process.env.PORT || 8797);
const distDir = path.resolve('dist');
const mimeTypes = {
  '.js': 'application/javascript; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${host}:${port}`);
    const pathname = decodeURIComponent(url.pathname);
    const basename = path.basename(pathname);
    const allowed =
      basename === 'zhihu-hide-menu-toolkit.user.js' ||
      basename === 'zhihu-hide-menu-toolkit.smoke.user.js' ||
      basename === 'zhihu-hide-menu-toolkit.legacy.user.js' ||
      basename === 'zhihu-hide-menu-toolkit.connectedgraph.user.js';

    if (!allowed) {
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }

    const filePath = path.join(distDir, basename);
    const body = await readFile(filePath);
    res.writeHead(200, {
      'content-type': mimeTypes[path.extname(filePath)] || 'application/octet-stream',
      'cache-control': 'no-store',
      'content-disposition': `inline; filename="${basename}"`,
      'x-userscript-name': basename,
    });
    res.end(body);
  } catch (error) {
    res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
    res.end(error instanceof Error ? error.message : String(error));
  }
});

server.listen(port, host, () => {
  console.log(`Serving userscripts on http://${host}:${port}/`);
  console.log(`Smoke:  http://${host}:${port}/zhihu-hide-menu-toolkit.smoke.user.js`);
  console.log(`Formal: http://${host}:${port}/zhihu-hide-menu-toolkit.user.js`);
  console.log(`Legacy: http://${host}:${port}/zhihu-hide-menu-toolkit.legacy.user.js`);
  console.log(`Reference-name replacement: http://${host}:${port}/zhihu-hide-menu-toolkit.connectedgraph.user.js`);
});
