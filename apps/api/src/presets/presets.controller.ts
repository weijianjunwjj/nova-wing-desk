import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { toPresetResponse, UpdatePresetDto } from './preset.dto.js';
import { PresetsService } from './presets.service.js';

@Controller('presets')
export class PresetsController {
  constructor(private readonly presets: PresetsService) {}

  @Get()
  async findAll() {
    return (await this.presets.findAll()).map(toPresetResponse);
  }

  @Patch(':key')
  async update(@Param('key') key: string, @Body() dto: UpdatePresetDto) {
    return toPresetResponse(await this.presets.update(key, dto));
  }
}
