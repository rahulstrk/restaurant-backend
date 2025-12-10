/* eslint-disable no-console */
import { migrate } from '../src/db/migrate.js';
import { seed } from '../src/db/seed.js';

async function setup() {
  try {
    // Run migrations first
    await migrate();
    // Then seed data
    await seed();
    console.log('✅ Setup completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ Setup failed:', err.message);
    process.exit(1);
  }
}

setup();
