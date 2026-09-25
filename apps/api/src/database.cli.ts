import { createDatabase } from './database.js';
import { seedDatabase } from './database/seed.js';

const command = process.argv[2];
if (command !== 'migrate' && command !== 'seed') {
  throw new Error('Usage: node dist/database.cli.js <migrate|seed>');
}

const database = createDatabase();

try {
  await database.initialize();

  if (command === 'migrate') {
    const migrations = await database.runMigrations();
    console.log(migrations.length === 0 ? 'Database is already up to date.' : `Applied ${migrations.length} migration(s).`);
  } else {
    await database.runMigrations();
    await seedDatabase(database);
    console.log('Seed data is present.');
  }
} finally {
  if (database.isInitialized) await database.destroy();
}
