import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Donador } from '@app/Entities/donador.entity';
import { Repository } from 'typeorm';
import { CreateDonadorDTO } from './dto/create-donador.dto';
import { UpdateDonadorDTO } from './dto/update-donador.dto';

@Injectable()
export class DonadorService {
    constructor(@InjectRepository(Donador) private donadorRepository : Repository<Donador>) {}

    async createDonador(createDonadorDTO : CreateDonadorDTO){
        try{
            const newDonador = await this.donadorRepository.create(createDonadorDTO);
            return await this.donadorRepository.save(newDonador);
        } catch(error){
            throw new BadRequestException('Error al crear un donador');
        }
    }

    async getAllDonador() {
        try{
            return await this.donadorRepository.find();
        } catch(error) {
            throw new NotFoundException('No se encontraron los datos');
        }
    }

    async getDonador(id : number){
        const donador = await this.donadorRepository.findOne({where: {id}});
        if(!donador){
            throw new NotFoundException('No se encontro al donador');
        }
        return donador;
    }

    async updateDonador(id: number,updateDonadorDTO : UpdateDonadorDTO){
        const donador = await this.donadorRepository.findOne({where: {id}});
        if(!donador){
            throw new NotFoundException('No se encontro al donador');
        } try {
            await this.donadorRepository.update(id , updateDonadorDTO);
            return await this.donadorRepository.findOne({where: {id}});
        } catch(error){
            throw new BadRequestException('Error al actualizar el donador');
        }
    }

    async deleteDonador(id: number){
        const donador = await this.donadorRepository.findOne({where:{id}});
        if(!donador){
            throw new NotFoundException('No se encontro al donador');
        } try {
            await this.donadorRepository.delete(id);
        } catch(error){
            throw new BadRequestException('Error al eliminar al donador');
        }
    }
    
}
