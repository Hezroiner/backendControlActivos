import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ProveedorService } from './proveedor.service';
import { CreateProveedorDTO } from './dto/create-proveedor.dto';
import { Proveedor } from '@app/Entities/proveedor.entity';
import { UpdateProveedorDTO } from './dto/update-proveedor.dto';

@Controller('proveedor')
export class ProveedorController {
    constructor(private proveedorService: ProveedorService) { }

    @Post()
    createProveedor(@Body() createProveedorDTO: CreateProveedorDTO): Promise<Proveedor> {
        return this.proveedorService.createProveedor(createProveedorDTO);
    }

    @Get()
    getAllProveedor(@Query('disponibilidad') disponibilidad? : string): Promise<Proveedor[]> {
        return this.proveedorService.getAllProveedor(disponibilidad);
    }

    @Get(':id')
    getProveedor(@Param('id') id: number) {
        return this.proveedorService.getProveedor(id);
    }

    @Patch(':id')
    updateProveedor(@Param('id') id: number, @Body() updateProveedorDTO: UpdateProveedorDTO) {
        return this.proveedorService.updateProveedor(id, updateProveedorDTO)
    }
    
    @Patch(':id/disponibilidad')
    updateDisponibilidadProveedor(@Param('id') id: number) {
        return this.proveedorService.updateDisponibilidadProveedor(id);
    } 
    
}
