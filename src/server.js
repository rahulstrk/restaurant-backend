import config from './config/index.js';
import app from './app.js';

const { port } = config;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running at http://localhost:${port} [env: ${config.nodeEnv}]`);
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
