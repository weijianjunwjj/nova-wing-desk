import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { databaseOptions } from './database.js';
import { ModelsModule } from './models/models.module.js';
import { PresetsModule } from './presets/presets.module.js';
import { RuntimeConfigModule } from './runtime-config/runtime-config.module.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...databaseOptions(),
      autoLoadEntities: true,
      migrationsRun: true,
    }),
    ModelsModule,
    PresetsModule,
    RuntimeConfigModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
