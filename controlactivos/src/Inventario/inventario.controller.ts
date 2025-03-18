// src/inventario/inventario.controller.ts

import { Controller, Post, Get, Param, Body, ParseIntPipe, Patch, Delete, UseGuards } from '@nestjs/common';
import { InventarioService } from './inventario.service';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { Inventario } from '@app/Entities/inventario.entity';
import { JwtAuthGuard } from '@app/auth/JwtAuthGuard';
import { RolesGuard } from '@app/auth/roles.guard';
import { Roles } from '@app/auth/roles.decorator';

@Controller('inventario')
export class InventarioController {
  constructor(private readonly inventarioService: InventarioService) {}

  // Endpoint para que el docente realice un inventario
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Docente')
  @Post()
  async create(@Body() createInventarioDto: CreateInventarioDto): Promise<Inventario> {
    return await this.inventarioService.createInventario(createInventarioDto);
  }

  // Endpoint para obtener todos los inventarios
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Docente')
  @Get()
  async findAll(): Promise<Inventario[]> {
    return await this.inventarioService.getAllInventarios();
  }

  // Endpoint para obtener un inventario por su ID
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Docente')
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Inventario> {
    return await this.inventarioService.getInventarioById(id);
  }

  // Endpoint para actualizar (editar) un inventario (ahora admite Docente y Administrador)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Docente', 'Administrador')
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<CreateInventarioDto> & { detalles: any[]; revisado?: boolean },
  ): Promise<Inventario> {
    return await this.inventarioService.updateInventario(id, updateData);
  }

  // Endpoint para eliminar un inventario
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Docente')
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.inventarioService.deleteInventario(id);
  }
}
