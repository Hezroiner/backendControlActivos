import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { LicenciaService } from './licencia.service';
import { Licencia } from '@app/Entities/licencia.entity';
import { UpdateLicenciaDTO } from './dto/update-licencia.dto';
import { CreateLicenciaDTO } from './dto/create-licencia.dto';

@Controller('licencia')
export class LicenciaController {
    constructor(private licenciaService: LicenciaService) { }

    @Post()
    async createLicencia(@Body() createLicenciaDTO: CreateLicenciaDTO): Promise<Licencia> {
        return await this.licenciaService.createLicencia(createLicenciaDTO);
    }

    @Get()
    async getAllLicencias(): Promise<Licencia[]> {
        return await this.licenciaService.getAllLicencias();
    }

    @Get(':id')
    async getLicenciaById(@Param('id') id: number): Promise<Licencia> {
        return await this.licenciaService.getLicenciaById(id);
    }

    @Patch(':id')
    async updateLicencia(@Param('id') id: number , @Body() updateLicenciaDTO: UpdateLicenciaDTO): Promise<Licencia> {
        return await this.licenciaService.updateLicencia(id, updateLicenciaDTO);
    }

    @Patch(':id/disponibilidad')
    updateDisponibilidadLicencia(@Param('id') id: number) {
        return this.licenciaService.updateDisponibilidadLicencia(id);
    } 
}
