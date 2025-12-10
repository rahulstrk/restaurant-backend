import config from './config/index.js';
import app from './app.js';

const { port } = config;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`
╔════════════════════════════════════════════╗
║   Restaurant Search API is Running        ║
║   Server: http://localhost:${port}         ║
║   Environment: ${config.nodeEnv.toUpperCase().padEnd(22)}║
╚════════════════════════════════════════════╝
  `);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  // eslint-disable-next-line no-console
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  // eslint-disable-next-line no-console
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});
