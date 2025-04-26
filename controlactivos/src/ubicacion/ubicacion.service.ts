import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ubicacion } from '@app/Entities/ubicacion.entity';
import { CreateUbicacionDTO } from './dto/create-ubicacion.dto';
import { UpdateUbicacionDTO } from './dto/update-ubicacion.dto';

@Injectable()
export class UbicacionService {
  constructor(
    @InjectRepository(Ubicacion)
    private ubicacionRepository: Repository<Ubicacion>
  ) { }

  async createUbicacion(createUbicacionDTO: CreateUbicacionDTO) {
    try {
      const newUbicacion = this.ubicacionRepository.create(createUbicacionDTO);
      return await this.ubicacionRepository.save(newUbicacion);
    } catch {
      throw new BadRequestException('Error al crear la ubicación');
    }
  }

  async getAllUbicacion(disponibilidad?: string): Promise<Ubicacion[]> {
    try {
      return await this.ubicacionRepository.find({ where: { disponibilidad }});
    } catch {
      throw new NotFoundException('No se encontraron las ubicaciones');
    }
  }

  async getUbicacion(id: number): Promise<Ubicacion> {
    const ubicacion = await this.ubicacionRepository.findOne({ where: { id } });
    if (!ubicacion) {
      throw new NotFoundException('No se encontró la ubicación');
    }
    return ubicacion;
  }

  async updateUbicacion(id: number, updateUbicacionDTO: UpdateUbicacionDTO): Promise<Ubicacion> {
    const ubicacion = await this.ubicacionRepository.findOne({ where: { id } });
    if (!ubicacion) {
      throw new NotFoundException(`No se encontró la ubicación con ID ${id}`);
    }
    try {
      const updatedUbicacion = Object.assign(ubicacion, updateUbicacionDTO);
      return await this.ubicacionRepository.save(updatedUbicacion);
    } catch (error) {
      throw new BadRequestException(`Error al actualizar la ubicación: ${error.message}`);
    }
  }

  async updateDisponibilidadUbicacion(id: number): Promise<void> {
    const ubicacion = await this.ubicacionRepository.findOne({ where: { id } });

    if (!ubicacion) {
      throw new NotFoundException('No se encontró la Ubicacion');
    }

    if (ubicacion.disponibilidad === 'Fuera de Servicio') {
      throw new BadRequestException('La Ubicacion ya está marcada como "Fuera de Servicio"');
    }

    ubicacion.disponibilidad = 'Fuera de Servicio';
    await this.ubicacionRepository.save(ubicacion);
  }
}
