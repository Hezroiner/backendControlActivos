import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePrestamoDTO } from './dto/create-prestamo.dto';
import { Prestamo } from '@app/Entities/prestamo.entity';
import { Activo } from '@app/Entities/activo.entity';
import { User } from '@app/Entities/user.entity';
import { Ubicacion } from '@app/Entities/ubicacion.entity';

@Injectable()
export class PrestamoService {
  constructor(
    @InjectRepository(Prestamo)
    private readonly prestamoRepository: Repository<Prestamo>,
    @InjectRepository(Activo)
    private readonly activoRepository: Repository<Activo>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Ubicacion)
    private readonly ubicacionRepository: Repository<Ubicacion>,
  ) {}

  async createPrestamo(createPrestamoDTO: CreatePrestamoDTO) {
    const { activoId, prestadoPorId, prestadoAId, ubicacionId, ubicacionActualId, fechaDevolucion } = createPrestamoDTO;

    const activo = await this.activoRepository.findOne({ where: { id: activoId } });
    if (!activo) {
      throw new NotFoundException(`Activo con id ${activoId} no encontrado`);
    }

    const prestadoPor = await this.userRepository.findOne({ where: { id: prestadoPorId } });
    if (!prestadoPor) {
      throw new NotFoundException(`Usuario que presta con id ${prestadoPorId} no encontrado`);
    }

    const prestadoA = await this.userRepository.findOne({ where: { id: prestadoAId } });
    if (!prestadoA) {
      throw new NotFoundException(`Usuario que recibe con id ${prestadoAId} no encontrado`);
    }

    const ubicacion = await this.ubicacionRepository.findOne({ where: { id: ubicacionId } });
    if (!ubicacion) {
      throw new NotFoundException(`Ubicación con id ${ubicacionId} no encontrada`);
    }

    const ubicacionActual = await this.ubicacionRepository.findOne({ where: { id: ubicacionActualId } });
    if (!ubicacionActual) {
      throw new NotFoundException(`Ubicación actual con id ${ubicacionActualId} no encontrada`);
    }

    const prestamo = this.prestamoRepository.create({
      activo,
      prestadoPor,
      prestadoA,
      ubicacion,
      ubicacionActual,  // Guardamos la ubicación actual
      fechaPrestamo: new Date(), // Fecha actual como fecha de préstamo
      fechaDevolucion: fechaDevolucion ? new Date(fechaDevolucion) : null,  // Fecha de devolución opcional
      estado: 'En préstamo',
    });

    try {
      return await this.prestamoRepository.save(prestamo);
    } catch (error) {
      throw new BadRequestException('Hubo un problema al guardar el préstamo');
    }
  }

  async updateEstado(id: number, estado: string) {
    const prestamo = await this.prestamoRepository.findOne({ where: { id } });
    if (!prestamo) {
      throw new NotFoundException('Préstamo no encontrado');
    }
    prestamo.estado = estado;
    if (estado === 'Devuelto') {
      prestamo.fechaDevolucion = new Date();
    }
    return this.prestamoRepository.save(prestamo);
  }
  
  async deletePrestamo(id: number) {
    const prestamo = await this.prestamoRepository.findOne({ where: { id } });
    if (!prestamo) {
      throw new NotFoundException('Préstamo no encontrado');
    }
    await this.prestamoRepository.remove(prestamo);
    return { message: 'Préstamo eliminado correctamente' };
  }

  async getPrestamosByUbicacion(ubicacionId: number) {
    return this.prestamoRepository.find({
      where: { ubicacion: { id: ubicacionId } },
      relations: ['activo', 'prestadoPor', 'prestadoA', 'ubicacion'],
    });
  }
  async getPrestamosByUsuario(prestadoPorId: number) {
    return this.prestamoRepository.find({
      where: { prestadoPor: { id: prestadoPorId } }, // Filtramos por los préstamos hechos por el usuario
      relations: ['activo', 'prestadoA', 'ubicacion', 'ubicacionActual'], // Cargamos las relaciones necesarias
    });
  }
  async getPrestamosByActivo(activoId: number) {
    const prestamos = await this.prestamoRepository.find({
      where: { activo: { id: activoId } },
      relations: ['prestadoPor', 'prestadoA', 'ubicacion', 'ubicacionActual', 'activo'], // Incluyendo la relación ubicacionActual
    });
    if (!prestamos.length) {
      throw new NotFoundException(`No se encontraron préstamos para el activo con ID ${activoId}`);
    }
    return prestamos;
  }

  async getAllPrestamos() {
    return this.prestamoRepository.find({
      relations: ['activo', 'prestadoPor', 'prestadoA', 'ubicacion', 'ubicacionActual'],
    });
  }
}
