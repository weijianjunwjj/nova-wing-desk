import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { databaseProvider } from './database.provider.js';
import { ModelRoutingController } from './model-routing.controller.js';
import { ModelRoutingService } from './model-routing.service.js';

@Module({
  controllers: [AppController, ModelRoutingController],
  providers: [databaseProvider, ModelRoutingService],
})
export class AppModule {}
