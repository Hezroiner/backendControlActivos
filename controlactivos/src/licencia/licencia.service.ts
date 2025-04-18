import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Licencia } from '@app/Entities/licencia.entity';
import { Repository } from 'typeorm';
import { UpdateLicenciaDTO } from './dto/update-licencia.dto';
import { CreateLicenciaDTO } from './dto/create-licencia.dto';
import { Licitacion } from '@app/Entities/licitacion.entity';


@Injectable()
export class LicenciaService {
  constructor(@InjectRepository(Licencia)
  private licenciaRepository: Repository<Licencia>,
     @InjectRepository(Licitacion)
        private licitacionRepository: Repository<Licitacion>
  ) { }

 async createLicencia(createLicenciaDTO: CreateLicenciaDTO): Promise<Licencia> {
     const { modoAdquisicion, licitacionId, vigenciaInicio, vigenciaFin } = createLicenciaDTO;

     if (!vigenciaInicio || !vigenciaFin) {
      throw new BadRequestException('Las fechas de vigencia son obligatorias');
    }

    const inicio = new Date(vigenciaInicio);
    const fin = new Date(vigenciaFin);

    if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
      throw new BadRequestException('Las fechas de vigencia deben ser válidas');
    }

    if (inicio >= fin) {
      throw new BadRequestException('La fecha de fin debe ser posterior a la fecha de inicio');
    }

     let licitacion = null;
     if (modoAdquisicion === 'Ley' && licitacionId) {
         licitacion = await this.licitacionRepository.findOne({ where: { id: licitacionId }, relations: ['ley'] });
         if (!licitacion) {
             throw new NotFoundException('Licitación no encontrada');
         }
     }
 
     const ultimaLicencia = await this.licenciaRepository.find({
         order: { id: 'DESC' },
         take: 1,
     });
 
     // Generar nuevo numPlaca
     let nuevoNumeroIdentificador: string;
     if (ultimaLicencia.length === 0) {
         // Si no hay activos, empezamos con "4197-0001"
         nuevoNumeroIdentificador = '4197-0001';
     } else {
         // Si ya hay activos, obtenemos el último numPlaca y lo incrementamos
         const ultimoNumero = parseInt(ultimaLicencia[0].numeroIdentificador.split('-')[1], 10) + 1;
         nuevoNumeroIdentificador = `4197-${ultimoNumero.toString().padStart(4, '0')}`;
     }
 
     // Crear el nuevo activo con el numPlaca generado
     const newLicencia = this.licenciaRepository.create({
         ...createLicenciaDTO, 
         disponibilidad: createLicenciaDTO.disponibilidad || 'En Servicio',
         numeroIdentificador: nuevoNumeroIdentificador,
         licitacion,
     });
 
     return await this.licenciaRepository.save(newLicencia);
 }

  
  async getAllLicencias(): Promise<Licencia[]> {
    return await this.licenciaRepository.find({
      relations: ['licitacion.ley', 'licitacion', 'licitacion.proveedor'],
    });
  }


  async getLicenciaById(id: number): Promise<Licencia> {
    const licencia = await this.licenciaRepository.findOne({
      where: { id },
      relations: ['licitacion.ley', 'licitacion.proveedor', 'licitacion'],
    });

    if (!licencia) {
      throw new NotFoundException(`Licencia con ID ${id} no encontrada`);
    }
    return licencia;
  }


  async updateLicencia(id: number, updateLicenciaDTO: UpdateLicenciaDTO): Promise<Licencia> {
    const licencia = await this.licenciaRepository.findOne({ where: { id } });
  
    if (!licencia) {
      throw new NotFoundException(`Licencia con ID ${id} no encontrada`);
    }
  
    if (updateLicenciaDTO.modoAdquisicion === 'Ley' && updateLicenciaDTO.licitacionId) {
      const licitacion = await this.licitacionRepository.findOne({ where: { id: updateLicenciaDTO.licitacionId }, relations: ['ley'] });

      if (!licitacion) {
          throw new NotFoundException('Licitación no encontrada');
      }
      licencia.licitacion = licitacion;
  } else if (updateLicenciaDTO.modoAdquisicion !== 'Ley') {

      licencia.licitacion = null;
  }
  
    Object.assign(licencia, updateLicenciaDTO);
    return await this.licenciaRepository.save(licencia);
  }

 
  async updateDisponibilidadLicencia(id: number): Promise<void> {
    const licencia = await this.licenciaRepository.findOne({ where: { id } });

    if (!licencia) {
      throw new NotFoundException('No se encontró la Licencia');
    }

    if (licencia.disponibilidad === 'Fuera de Servicio') {
      throw new BadRequestException('La Licencia ya está marcada como "Fuera de Servicio"');
    }

    licencia.disponibilidad = 'Fuera de Servicio';
    await this.licenciaRepository.save(licencia);
  }

}
