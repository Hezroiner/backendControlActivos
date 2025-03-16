import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventario } from '@app/Entities/inventario.entity';
import { InventarioDetalle } from '@app/Entities/inventario-detalle.entity';
import { User } from '@app/Entities/user.entity';
import { Ubicacion } from '@app/Entities/ubicacion.entity';
import { Activo } from '@app/Entities/activo.entity';
import { InventarioService } from './inventario.service';
import { InventarioController } from './inventario.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inventario, InventarioDetalle, User, Ubicacion, Activo]),
  ],
  providers: [InventarioService],
  controllers: [InventarioController],
  exports: [InventarioService],
})
export class InventarioModule {}
