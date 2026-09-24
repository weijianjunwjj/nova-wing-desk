import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { InitialConfigRegistry1720000000000 } from './database/migrations/1720000000000-initial-config-registry.js';
import { ModelsModule } from './models/models.module.js';
import { PresetsModule } from './presets/presets.module.js';
import { RuntimeConfigModule } from './runtime-config/runtime-config.module.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST ?? 'localhost',
      port: Number(process.env.POSTGRES_PORT ?? 5432),
      username: process.env.POSTGRES_USER ?? 'novawing',
      password: process.env.POSTGRES_PASSWORD ?? 'novawing',
      database: process.env.POSTGRES_DB ?? 'novawing_desk',
      autoLoadEntities: true,
      synchronize: false,
      migrationsRun: true,
      migrations: [InitialConfigRegistry1720000000000],
    }),
    ModelsModule,
    PresetsModule,
    RuntimeConfigModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
