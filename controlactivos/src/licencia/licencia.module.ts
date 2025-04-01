import { Module } from '@nestjs/common';
import { LicenciaService } from './licencia.service';
import { LicenciaController } from './licencia.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Licencia } from '@app/Entities/licencia.entity';
import { Licitacion } from '@app/Entities/licitacion.entity';


@Module({
  imports : [TypeOrmModule.forFeature([Licencia, Licitacion])],
  providers: [LicenciaService],
  controllers: [LicenciaController],
})
export class LicenciaModule {}
