import { createDatabase } from './database.js';
import { DEFAULT_MODEL_ROUTING } from './model-routing.js';

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
    await database
      .createQueryBuilder()
      .insert()
      .into('desk_config')
      .values({ key: 'model-routing', value: DEFAULT_MODEL_ROUTING, revision: 0 })
      .orIgnore()
      .execute();
    console.log('Seed data is present.');
  }
} finally {
  if (database.isInitialized) await database.destroy();
}
