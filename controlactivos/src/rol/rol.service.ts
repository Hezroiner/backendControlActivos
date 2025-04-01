import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateRolDTO } from './dto/update-rol.dto';
import { Rol } from '@app/Entities/rol.entity';


@Injectable()
export class RolService implements OnApplicationBootstrap {
    private readonly logger = new Logger(RolService.name);

    constructor(@InjectRepository(Rol) private rolRepository: Repository<Rol>) { }
    
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

    async onApplicationBootstrap() {
        const count = await this.rolRepository.count();
        if (count === 0) {
          const roles = [
            this.rolRepository.create({
              id: 1,
              nombre: 'Administrador',
              descripcion: 'Manejo de inventario de Activos de docente, cada docente se le asignará una cantidad de activos',
            }),
            this.rolRepository.create({
              id: 2,
              nombre: 'Docente',
              descripcion: 'Encargado de gestionar y supervisar las operaciones y recursos de la institución.',
            }),
          ];
          await this.rolRepository.save(roles);
          this.logger.log('Roles iniciales creados correctamente');
        }
    }    
}
