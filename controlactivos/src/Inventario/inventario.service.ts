import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventario } from '@app/Entities/inventario.entity';
import { InventarioDetalle } from '@app/Entities/inventario-detalle.entity';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { User } from '@app/Entities/user.entity';
import { Ubicacion } from '@app/Entities/ubicacion.entity';
import { Activo } from '@app/Entities/activo.entity';

@Injectable()
export class InventarioService {
  constructor(
    @InjectRepository(Inventario)
    private readonly inventarioRepository: Repository<Inventario>,
    @InjectRepository(InventarioDetalle)
    private readonly inventarioDetalleRepository: Repository<InventarioDetalle>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Ubicacion)
    private readonly ubicacionRepository: Repository<Ubicacion>,
    @InjectRepository(Activo)
    private readonly activoRepository: Repository<Activo>,
  ) {}

  async createInventario(createInventarioDto: CreateInventarioDto): Promise<Inventario> {
    // Verificar que el docente exista
    const docente = await this.userRepository.findOne({ where: { id: createInventarioDto.docenteId } });
    if (!docente) {
      throw new NotFoundException('Docente no encontrado');
    }

    // Verificar que la ubicación exista
    const ubicacion = await this.ubicacionRepository.findOne({ where: { id: createInventarioDto.ubicacionId } });
    if (!ubicacion) {
      throw new NotFoundException('Ubicación no encontrada');
    }

    // Crear el registro de inventario
    const inventario = this.inventarioRepository.create({
      fecha: createInventarioDto.fecha,
      docente: docente,
      ubicacion: ubicacion,
    });

    const inventarioGuardado = await this.inventarioRepository.save(inventario);

    // Procesar cada detalle del inventario
    for (const detalleDto of createInventarioDto.detalles) {
      // Verificar que el activo exista
      const activo = await this.activoRepository.findOne({ where: { id: detalleDto.activoId } });
      if (!activo) {
        throw new NotFoundException(`Activo con id ${detalleDto.activoId} no encontrado`);
      }
      const detalle = this.inventarioDetalleRepository.create({
        inventario: inventarioGuardado,
        activo: activo,
        estadoProvisional: detalleDto.estadoProvisional,
        detalle: detalleDto.detalle,
      });
      await this.inventarioDetalleRepository.save(detalle);
    }

    // Retornar el inventario con sus relaciones completas
    return await this.inventarioRepository.findOne({
      where: { id: inventarioGuardado.id },
      relations: ['docente', 'ubicacion', 'detalles', 'detalles.activo'],
    });
  }

  async getAllInventarios(): Promise<Inventario[]> {
    return await this.inventarioRepository.find({
      relations: ['docente', 'ubicacion', 'detalles', 'detalles.activo'],
    });
  }

  async getInventarioById(id: number): Promise<Inventario> {
    const inventario = await this.inventarioRepository.findOne({
      where: { id },
      relations: ['docente', 'ubicacion', 'detalles', 'detalles.activo'],
    });
    if (!inventario) {
      throw new NotFoundException('Inventario no encontrado');
    }
    return inventario;
  }
}
