import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventario } from '@app/Entities/inventario.entity';
import { InventarioDetalle } from '@app/Entities/inventario-detalle.entity';
import { User } from '@app/Entities/user.entity';
import { Ubicacion } from '@app/Entities/ubicacion.entity';
import { Activo } from '@app/Entities/activo.entity';
import { InventarioService } from './inventario.service';
import { InventarioController } from './inventario.controller';
import { AuthModule } from '@app/auth/auth.module';
import { RolesGuard } from '@app/auth/roles.guard';


@Module({
  imports: [
    TypeOrmModule.forFeature([Inventario, InventarioDetalle, User, Ubicacion, Activo]),
    forwardRef(() => AuthModule), 
  ],
  providers: [InventarioService, RolesGuard], // Agrega RolesGuard a providers
  controllers: [InventarioController],
  exports: [InventarioService],
})
export class InventarioModule {}
