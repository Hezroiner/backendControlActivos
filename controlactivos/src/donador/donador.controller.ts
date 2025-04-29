import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { DonadorService } from './donador.service';
import { CreateDonadorDTO } from './dto/create-donador.dto';
import { Donador } from '@app/Entities/donador.entity';
import { UpdateDonadorDTO } from './dto/update-donador.dto';

@Controller('donador')
export class DonadorController {
    constructor(private donadorService: DonadorService) { }

    @Post()
    createDonador(@Body() createDonadorDTO: CreateDonadorDTO) : Promise<Donador> {
        return this.donadorService.createDonador(createDonadorDTO);
    }

    @Get()
    getAllDonador(): Promise<Donador[]> {
        return this.donadorService.getAllDonador();
    }

    @Get(':id')
    getDonador(@Param('id') id: number): Promise<Donador> {
        return this.donadorService.getDonador(id);
    }

    @Patch(':id')
    updateDonador(@Param('id') id: number, @Body() updateDonadorDTO: UpdateDonadorDTO) {
        return this.donadorService.updateDonador(id, updateDonadorDTO);
    }

    @Delete(':id')
    deleteDonador(@Param('id') id: number) {
        this.donadorService.deleteDonador(id);
    }
}
