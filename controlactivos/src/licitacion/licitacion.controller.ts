import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { LicitacionService } from './licitacion.service';
import { Licitacion } from '@app/Entities/licitacion.entity';
import { UpdateLicitacionDTO } from '@app/licitacion/dto/update-licitacion.dto';
import { CreateLicitacionDTO } from './dto/create-licitacion.dto';

@Controller('licitacion')
export class LicitacionController {
    constructor(private licitacionService : LicitacionService) {}

    @Post()
    createLicitacion(@Body() createLicitacionDTO : CreateLicitacionDTO): Promise<Licitacion> {
        return this.licitacionService.createLicitacion(createLicitacionDTO);
    }

    @Get()
    getAllLicitacion(@Query('disponibilidad') disponibilidad? : string): Promise<Licitacion[]>{
        return this.licitacionService.getAllLicitacion(disponibilidad)
    }

    @Get(':id')
    getLicitacion(@Param('id') id : number){
        return this.licitacionService.getLicitacion(id);
    }

    @Patch(':id')
    updateLicitacion(@Param('id') id : number, @Body() updateLicitacionDTO : UpdateLicitacionDTO) {
        return this.licitacionService.updateLicitacion(id,updateLicitacionDTO);
    }

    @Patch(':id/disponibilidad')
    updateDisponibilidadLicitacion(@Param('id') id: number) {
        return this.licitacionService.updateDisponibilidadLicitacion(id);
    } 
}
