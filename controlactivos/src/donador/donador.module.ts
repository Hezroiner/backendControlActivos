import { Module } from '@nestjs/common';
import { DonadorService } from './donador.service';
import { DonadorController } from './donador.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Donador } from 'src/Entities/donador.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Donador])],
  providers: [DonadorService],
  controllers: [DonadorController]
})
export class DonadorModule {}
