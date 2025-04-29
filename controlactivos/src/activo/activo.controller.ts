import { Body, Controller, Delete, Get, Param, Patch, Post, Res } from '@nestjs/common';
import { ActivoService } from './activo.service';
import { UpdateActivoDTO } from './dto/update-activo.dto';
import { Activo } from '@app/Entities/activo.entity';
import { CreateActivoDTO } from './dto/create-activo.dto';
import { Response } from 'express';

@Controller('activo')
export class ActivoController {
  constructor(private activoService: ActivoService) {}

  @Post()
  async createActivo(@Body() createActivoDTO: CreateActivoDTO): Promise<Activo> {
    return await this.activoService.createActivo(createActivoDTO);
  }

  @Get()
  async getAllActivos(): Promise<Activo[]> {
    return await this.activoService.getAllActivos();
  }

  @Get(':id')
  async getActivo(@Param('id') id: number): Promise<Activo> {
    return await this.activoService.getActivo(id);
  }

  @Get('ubicacion/:ubicacionId')
  async getActivosByUbicacion(@Param('ubicacionId') ubicacionId: number): Promise<Activo[]> {
    return await this.activoService.getActivosByUbicacion(ubicacionId);
  }

  @Patch(':id')
  async updateActivo(@Param('id') id: number, @Body() updateActivoDTO: UpdateActivoDTO): Promise<Activo> {
    return await this.activoService.updateActivo(id, updateActivoDTO);
  }

  @Delete(':id')
  async deleteActivo(@Param('id') id: number): Promise<void> {
    return await this.activoService.deleteActivo(id);
  }

  // Nuevo endpoint para generar el código de barras llamando al servicio
  @Get('barcode/:numPlaca')
  async generateBarcode(@Param('numPlaca') numPlaca: string, @Res() res: Response): Promise<void> {
    return this.activoService.generateBarcode(numPlaca, res);
  }
}
