import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { CreateRolDTO } from './dto/create-rol.dto';
import { UpdateRolDTO } from './dto/update-rol.dto';
import { Rol } from '@app/Entities/rol.entity';


@Injectable()
export class RolService {
    constructor(@InjectRepository(Rol) private rolRepository: Repository<Rol>) { }

    async createRol(createRolDTO: CreateRolDTO) {
        try {
            const newRol = await this.rolRepository.create(createRolDTO);
            return await this.rolRepository.save(newRol);
        } catch (error) {
            throw new BadRequestException('Error al crear el Rol');
        }
    }

    async getAllRoles() {
        try {
            return await this.rolRepository.find()
        } catch (error) {
            throw new NotFoundException('No se encontraron los datos');
        }
    }

    async getRol(id: number) {
        const rol = await this.rolRepository.findOne({ where: { id } });
        if (!rol) {
            throw new NotFoundException('No se encontro el rol seleccionado');
        }
        return rol;
    }

    async updateRol(id: number, updateRolDTO: UpdateRolDTO) {
        const rol = await this.rolRepository.findOne({ where: { id } });
        if (!rol) {
            throw new NotFoundException('No se encontro el rol seleccionado');
        } try {
            await this.rolRepository.update(id, updateRolDTO);
            return await this.rolRepository.findOne({ where: { id } })
        } catch (error) {
            throw new BadRequestException('Error al actualizar el rol');
        }
    }
    async deleteRol(id: number) {
        const rol = await this.rolRepository.findOne({ where: { id } });
        if (!rol) {
            throw new NotFoundException('No se encontro el rol seleccionado');
        } try {
            return await this.rolRepository.delete(id);
        } catch (error) {
            throw new BadRequestException('Error al eliminar un rol');
        }
    }

}
