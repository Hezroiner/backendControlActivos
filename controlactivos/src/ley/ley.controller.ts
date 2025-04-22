import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { LeyService } from './ley.service';
import { CreateLeyDTO } from './dto/create-ley.dto';
import { Ley } from '@app/Entities/ley.entity';
import { UpdateLeyDTO } from './dto/update-ley.dto';

@Controller('ley')
export class LeyController {
    constructor(private leyService: LeyService) { }

    @Post()
    createLey(@Body() createLeyDTO: CreateLeyDTO): Promise<Ley> {
        return this.leyService.createLey(createLeyDTO);
    }

    @Get()
    getAllLey(@Query("disponibilidad")disponibilidad:string): Promise<Ley[]> {
        return this.leyService.getAllLey(disponibilidad);
    }

    @Get(':id')
    getLey(@Param('id') id: number) {
        return this.leyService.getLey(id);
    }

    @Patch(':id')
    updateLey(@Param('id') id: number,@Body() updateLeyDTO: UpdateLeyDTO) {
        return this.leyService.updateLey(id, updateLeyDTO);
    }

    @Patch(':id/disponibilidad')
    updateDisponibilidadLey(@Param('id') id: number) {
        return this.leyService.updateDisponibilidadLey(id);
    }    

}
