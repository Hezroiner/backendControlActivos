import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Licencia } from '@app/Entities/licencia.entity';
import { Repository } from 'typeorm';
import { UpdateLicenciaDTO } from './dto/update-licencia.dto';
import { CreateLicenciaDTO } from './dto/create-licencia.dto';
import { Ley } from '@app/Entities/ley.entity';

@Injectable()
export class LicenciaService {
  constructor(@InjectRepository(Licencia)
  private licenciaRepository: Repository<Licencia>,
    @InjectRepository(Ley)
    private leyRepository: Repository<Ley>,
  ) { }

  async createLicencia(createLicenciaDTO: CreateLicenciaDTO): Promise<Licencia> {
    const { modoAdquisicion, leyId, vigenciaInicio, vigenciaFin } = createLicenciaDTO;

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

    let ley = null;
    if (modoAdquisicion === 'Ley' && leyId) {
      ley = await this.leyRepository.findOne({ where: { id: leyId } });
      if (!ley) {
        throw new NotFoundException('Ley no encontrada');
      }
    }

    const newLicencia = this.licenciaRepository.create({
      ...createLicenciaDTO,
      ley, 
    });

    try {
      const savedLicencia = await this.licenciaRepository.save(newLicencia);
      if (!savedLicencia) {
        throw new InternalServerErrorException('No se pudo crear la licencia');
      }
      return savedLicencia;
    } catch (error) {
      throw new InternalServerErrorException('Ocurrió un error al crear la licencia');
    }
  }
  
  async getAllLicencias(): Promise<Licencia[]> {
    return await this.licenciaRepository.find({
      relations: ['ley', 'donador'],
    });
  }

  async getLicenciaById(id: number): Promise<Licencia> {
    const licencia = await this.licenciaRepository.findOne({
      where: { id },
      relations: ['ley', 'donador'],
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
  
    if (updateLicenciaDTO.modoAdquisicion === 'Ley' && updateLicenciaDTO.leyId) {
      const ley = await this.leyRepository.findOne({ where: { id: updateLicenciaDTO.leyId } });
  
      if (!ley) {
        throw new NotFoundException('Ley no encontrada');
      }
      licencia.ley = ley;
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
