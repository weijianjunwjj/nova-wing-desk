import { DataSource } from 'typeorm';
import { createDatabase } from './database.js';

export const databaseProvider = {
  provide: DataSource,
  useFactory: async (): Promise<DataSource> => {
    const dataSource = createDatabase();
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
