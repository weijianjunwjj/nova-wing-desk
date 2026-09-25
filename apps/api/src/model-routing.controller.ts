import { BadRequestException, Body, Controller, Get, Put } from '@nestjs/common';
import { parseModelRoutingUpdate } from './model-routing.js';
import { ModelRoutingService } from './model-routing.service.js';

@Controller('config/model-routing')
export class ModelRoutingController {
  constructor(private readonly modelRouting: ModelRoutingService) {}

  @Get()
  get() {
    return this.modelRouting.get();
  }

  @Put()
  update(@Body() body: unknown) {
    try {
      return this.modelRouting.update(parseModelRoutingUpdate(body));
    } catch (error) {
      if (error instanceof Error) throw new BadRequestException(error.message);
      throw error;
    }
  }
}
