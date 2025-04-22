import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Activo } from '@app/Entities/activo.entity';
import { Ubicacion } from '@app/Entities/ubicacion.entity';
import { Licitacion } from '@app/Entities/licitacion.entity'; // Importamos la entidad Licitacion
import { Repository } from 'typeorm';
import { CreateActivoDTO } from './dto/create-activo.dto';
import { UpdateActivoDTO } from './dto/update-activo.dto';
import * as bwipjs from 'bwip-js';
import { Response } from 'express';

@Injectable()
export class ActivoService {
  constructor(
    @InjectRepository(Ubicacion)
    private ubicacionRepository: Repository<Ubicacion>,
    @InjectRepository(Activo)
    private activoRepository: Repository<Activo>,
    @InjectRepository(Licitacion)
    private licitacionRepository: Repository<Licitacion>
  ) {}

  async createActivo(createActivoDTO: CreateActivoDTO): Promise<Activo> {
    const { ubicacionId, modoAdquisicion, licitacionId } = createActivoDTO;

    const ubicacion = await this.ubicacionRepository.findOne({ where: { id: ubicacionId } });
    if (!ubicacion) {
        throw new NotFoundException('Ubicación no encontrada');
    }

    let licitacion = null;
    if (modoAdquisicion === 'Ley' && licitacionId) {
        licitacion = await this.licitacionRepository.findOne({ where: { id: licitacionId }, relations: ['ley'] });
        if (!licitacion) {
            throw new NotFoundException('Licitación no encontrada');
        }
    }

    const ultimoActivo = await this.activoRepository.find({
        order: { id: 'DESC' },
        take: 1,
    });

    let nuevoNumPlaca: string;
    if (ultimoActivo.length === 0) {
        nuevoNumPlaca = '4197-0001';
    } else {
        const ultimoNumero = parseInt(ultimoActivo[0].numPlaca.split('-')[1], 10) + 1;
        nuevoNumPlaca = `4197-${ultimoNumero.toString().padStart(4, '0')}`;
    }

    const newActivo = this.activoRepository.create({
        ...createActivoDTO, 
        disponibilidad: createActivoDTO.disponibilidad || 'En Servicio',
        estado: createActivoDTO.estado || 'Bueno',
        numPlaca: nuevoNumPlaca,
        ubicacion,
        licitacion,
    });

    return await this.activoRepository.save(newActivo);
}

  
  async getAllActivos(): Promise<Activo[]> {
    return await this.activoRepository.find({ relations: ['ubicacion', 'licitacion', 'licitacion.ley', 'licitacion.proveedor'] });
  }

  async getActivo(id: number): Promise<Activo> {
    const activo = await this.activoRepository.findOne({ where: { id }, relations: ['ubicacion', 'licitacion', 'licitacion.ley', 'licitacion.proveedor'] });

    if (!activo) {
      throw new NotFoundException(`Activo con ID ${id} no encontrado`);
    }
    return activo;
  }

  async getActivosByUbicacion(ubicacionId: number): Promise<Activo[]> {
    const activos = await this.activoRepository.find({ where: { ubicacion: { id: ubicacionId } }, relations: ['ubicacion', 'licitacion', 'licitacion.ley'] });

    if (!activos.length) {
      throw new NotFoundException(`No se encontraron activos para la ubicación con ID ${ubicacionId}`);
    }

    return activos;
  }

  async updateActivo(id: number, updateActivoDTO: UpdateActivoDTO): Promise<Activo> {

    const activo = await this.activoRepository.findOne({ where: { id }, relations: ['ubicacion', 'licitacion'] });

    if (!activo) {
        throw new NotFoundException(`Activo con ID ${id} no encontrado`);
    }

    if (updateActivoDTO.ubicacionId) {
        const ubicacion = await this.ubicacionRepository.findOne({ where: { id: updateActivoDTO.ubicacionId } });

        if (!ubicacion) {
            throw new NotFoundException('Ubicación no encontrada');
        }
        activo.ubicacion = ubicacion;
    }

    // Actualizar la licitación si se proporciona y el modo de adquisición es 'Ley'
    if (updateActivoDTO.modoAdquisicion === 'Ley' && updateActivoDTO.licitacionId) {
        const licitacion = await this.licitacionRepository.findOne({ where: { id: updateActivoDTO.licitacionId }, relations: ['ley'] });

        if (!licitacion) {
            throw new NotFoundException('Licitación no encontrada');
        }
        activo.licitacion = licitacion;
    } else if (updateActivoDTO.modoAdquisicion !== 'Ley') {
        // Si el modo de adquisición no es 'Ley', eliminamos cualquier relación con licitación
        activo.licitacion = null;
    }

    // Si se proporciona un numPlaca en el DTO, usarlo; de lo contrario, conservar el existente
    if (updateActivoDTO.numPlaca) {
        activo.numPlaca = String(updateActivoDTO.numPlaca);
    }

    // Actualizar el resto de los campos sin sobrescribir campos importantes como `numPlaca` si no se proporciona uno nuevo
    const { numPlaca, ubicacionId, licitacionId, ...restoDatos } = updateActivoDTO;
    Object.assign(activo, restoDatos);

    // Guardar los cambios en la base de datos
    return await this.activoRepository.save(activo);
}

async updateDisponibilidadActivo(id: number): Promise<void> {
  const activo = await this.activoRepository.findOne({ where: { id } });

  if (!activo) {
    throw new NotFoundException('No se encontró el Activo');
  }

  if (activo.disponibilidad === 'Fuera de Servicio') {
    throw new BadRequestException('El Activo ya está marcado como "Fuera de Servicio"');
  }

  activo.disponibilidad = 'Fuera de Servicio';
  await this.activoRepository.save(activo);
}

  // async deleteActivo(id: number): Promise<void> {
  //   const result = await this.activoRepository.delete(id);

  //   if (result.affected === 0) {
  //     throw new NotFoundException(`Activo con ID ${id} no encontrado`);
  //   }
  // }

  // Lógica para generar el código de barras
  async generateBarcode(numPlaca: string, res: Response): Promise<void> {
    try {
      bwipjs.toBuffer({
        bcid: 'code128',       // Formato de código de barras
        text: numPlaca,        // El número de placa
        scale: 3,              // Escala
        height: 10,            // Altura del código de barras
        includetext: true,     // Incluir el texto del número de placa
        textxalign: 'center',  // Alineación del texto
      }, (err, png) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.setHeader('Content-Type', 'image/png');
          res.send(png);
        }
      });
    } catch (error) {
      res.status(500).send('Error generando el código de barras');
    }
  }
}
