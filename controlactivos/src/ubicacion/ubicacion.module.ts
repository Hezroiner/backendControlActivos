import { Module } from '@nestjs/common';
import { UbicacionService } from './ubicacion.service';
import { UbicacionController } from './ubicacion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ubicacion } from '@app/Entities/ubicacion.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Ubicacion])],
  providers: [UbicacionService],
  controllers: [UbicacionController],
  exports: [UbicacionService]
})
export class UbicacionModule {}
