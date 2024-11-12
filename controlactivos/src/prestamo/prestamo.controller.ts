import { Controller, Post, Body, Param, Get, Patch, UseGuards, Delete } from '@nestjs/common';
import { PrestamoService } from './prestamo.service';
import { CreatePrestamoDTO } from './dto/create-prestamo.dto';
import { Roles } from '@app/Auth/roles.decorator';
import { RolesGuard } from '@app/Auth/roles.guard';
import { JwtAuthGuard } from '@app/Auth/JwtAuthGuard';

@Controller('prestamos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PrestamoController {
  constructor(private readonly prestamoService: PrestamoService) {}

  @Get('ubicacion/:ubicacionId')
  @Roles('Docente', 'Administrador')
  async getPrestamosByUbicacion(@Param('ubicacionId') ubicacionId: number) {
    return this.prestamoService.getPrestamosByUbicacion(ubicacionId);
  }

  @Get('usuario/:prestadoPorId')
  @Roles('Docente', 'Administrador')
  async getPrestamosByUsuario(@Param('prestadoPorId') prestadoPorId: number) {
    return this.prestamoService.getPrestamosByUsuario(prestadoPorId);
  }

  @Post()
  @Roles('Docente', 'Administrador')
  async createPrestamo(@Body() createPrestamoDTO: CreatePrestamoDTO) {
    return this.prestamoService.createPrestamo(createPrestamoDTO);
  }

  @Patch(':id/estado')
  @Roles('Docente', 'Administrador')
  async updateEstado(@Param('id') id: number, @Body() estado: { estado: string }) {
    return this.prestamoService.updateEstado(id, estado.estado);
  }

  @Delete(':id')
  @Roles('Docente', 'Administrador')  // Solo docentes o administradores pueden borrar préstamos
  async deletePrestamo(@Param('id') id: number) {
    return this.prestamoService.deletePrestamo(id);
  }
}
