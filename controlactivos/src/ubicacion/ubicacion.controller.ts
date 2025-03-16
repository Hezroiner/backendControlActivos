import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UbicacionService } from './ubicacion.service';
import { CreateUbicacionDTO } from './dto/create-ubicacion.dto';
import { Ubicacion } from '@app/Entities/ubicacion.entity';
import { UpdateUbicacionDTO } from './dto/update-ubicacion.dto';

@Controller('ubicacion')
export class UbicacionController {
    constructor(private ubicacionService: UbicacionService) { }

    @Post()
    createUbicacion(@Body() createUbicacionDTO: CreateUbicacionDTO): Promise<Ubicacion> {
        return this.ubicacionService.createUbicacion(createUbicacionDTO);
    }

    @Get()
    getAllUbicacion(): Promise<Ubicacion[]>{
        return this.ubicacionService.getAllUbicacion();
    }

    @Get(':id')
    getUbicacion(@Param('id') id : number ){
        return this.ubicacionService.getUbicacion(id);
    }

    @Patch(':id')
    updateUbicacion(@Param('id')id: number, @Body() updateUbicacionDTO : UpdateUbicacionDTO){
        return this.ubicacionService.updateUbicacion(id, updateUbicacionDTO)
    }

    @Patch(':id/disponibilidad')
    updateDisponibilidadUbicacion(@Param('id') id: number) {
        return this.ubicacionService.updateDisponibilidadUbicacion(id);
    }  
    
}
