import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { CreateModelDto, toModelResponse, UpdateModelDto } from './model.dto.js';
import { ModelsService } from './models.service.js';

@Controller('models')
export class ModelsController {
  constructor(private readonly models: ModelsService) {}

  @Get()
  async findAll() {
    return Promise.all((await this.models.findAll()).map(toModelResponse));
  }

  @Post()
  async create(@Body() dto: CreateModelDto) {
    return toModelResponse(await this.models.create(dto));
  }

  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateModelDto) {
    return toModelResponse(await this.models.update(id, dto));
  }
}
