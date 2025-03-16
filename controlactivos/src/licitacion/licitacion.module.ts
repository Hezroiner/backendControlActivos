import { Module } from '@nestjs/common';
import { LicitacionService } from './licitacion.service';
import { LicitacionController } from './licitacion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Licitacion } from '@app/Entities/licitacion.entity';
import { Proveedor } from '@app/Entities/proveedor.entity';
import { ProveedorService } from '@app/proveedor/proveedor.service';
import { Ley } from '@app/Entities/ley.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Licitacion, Proveedor, Ley])],
    providers: [LicitacionService, ProveedorService],
    controllers: [LicitacionController],
    exports: [LicitacionService]
})
export class LicitacionModule { }
