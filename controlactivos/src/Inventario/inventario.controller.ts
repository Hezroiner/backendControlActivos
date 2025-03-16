import { Controller, Post, Get, Param, Body, ParseIntPipe, UseGuards } from '@nestjs/common';
import { InventarioService } from './inventario.service';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { Inventario } from '@app/Entities/inventario.entity';
import { JwtAuthGuard } from '@app/Auth/JwtAuthGuard';
import { RolesGuard } from '@app/Auth/roles.guard';
import { Roles } from '@app/Auth/roles.decorator';

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
}
