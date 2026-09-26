/**
 * Server Entry Point
 * Express Server bridging Backend APIs with Vite SPA Middleware
 */
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { createBackendApp } from './backend/src/app';

const PORT = 3000;

async function startServer() {
  // Initialize the MNC backend express app
  const app = createBackendApp();

  // Vite middleware setup for Development vs Production Static files
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Flipkart Marketplace Server running on http://localhost:${PORT}`);
  });
}

startServer();
