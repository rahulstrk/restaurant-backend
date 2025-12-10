/* eslint-disable no-console */
import { migrate } from '../src/db/migrate.js';

migrate()
  .then(() => {
    console.log('✅ Database migration completed successfully');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  });
