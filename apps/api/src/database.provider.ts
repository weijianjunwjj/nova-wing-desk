import { DataSource } from 'typeorm';
import { ConfigRecord } from './config-record.entity.js';
import { CreateDeskConfig1727000000000 } from './migrations/1727000000000-CreateDeskConfig.js';

export const databaseProvider = {
  provide: DataSource,
  useFactory: async (): Promise<DataSource> => {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL is required for NovaWing Desk');
    const dataSource = new DataSource({
      type: 'postgres',
      url,
      entities: [ConfigRecord],
      migrations: [CreateDeskConfig1727000000000],
      synchronize: false,
      migrationsTableName: 'desk_migrations',
    });
    await dataSource.initialize();
    try {
      await dataSource.runMigrations();
      return dataSource;
    } catch (error) {
      await dataSource.destroy();
      throw error;
    }
  },
};
