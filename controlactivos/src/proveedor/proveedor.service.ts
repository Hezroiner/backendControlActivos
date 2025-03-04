import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Proveedor } from '@app/Entities/proveedor.entity';
import { Repository } from 'typeorm';
import { CreateProveedorDTO } from './dto/create-proveedor.dto';
import { UpdateProveedorDTO } from './dto/update-proveedor.dto';

@Injectable()
export class ProveedorService {
    constructor(@InjectRepository(Proveedor) private proveedorRepository: Repository<Proveedor>) { }

    async createProveedor(createProveedorDTO: CreateProveedorDTO) {
        try {
            const newProveedor = await this.proveedorRepository.create(createProveedorDTO);
            return await this.proveedorRepository.save(newProveedor);
        } catch (error) {
            throw new BadRequestException('Error al crear un Proveedor AAAA');
        }
    }

    async getAllProveedor() {
        try {
            return await this.proveedorRepository.find();
        } catch (error) {
            throw new NotFoundException('No se encontraron los Proveedores');
        }
    }

    async getProveedor(id: number) {
        const proveedor = await this.proveedorRepository.findOne({ where: { id } });
        if (!proveedor) {
            throw new NotFoundException('No se encontro al Proveedor');
        }
        return proveedor;
    }

    async updateProveedor(id: number, updateProveedor: UpdateProveedorDTO) {
        const proveedor = await this.proveedorRepository.findOne({ where: { id } });
        if (!proveedor) {
            throw new NotFoundException('No se encontro al Proveedor');
        } try {
            await this.proveedorRepository.update({ id }, updateProveedor);
            return await this.proveedorRepository.findOne({ where: { id } });
        } catch (error) {
            throw new BadRequestException('Error al actualizar al proveedor');
        }
    }

    async updateDisponibilidadProveedor(id: number): Promise<void> {
        const proveedor = await this.proveedorRepository.findOne({ where: { id } });
    
        if (!proveedor) {
          throw new NotFoundException('No se encontró al Proveedor');
        }
    
        if (proveedor.disponibilidad === 'Fuera de Servicio') {
          throw new BadRequestException('El Proveedor ya está marcado como "Fuera de Servicio"');
        }
    
        proveedor.disponibilidad = 'Fuera de Servicio';
        await this.proveedorRepository.save(proveedor);
      }

}
