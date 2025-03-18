import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prestamo } from '@app/Entities/prestamo.entity';
import { PrestamoController } from './prestamo.controller';
import { PrestamoService } from './prestamo.service';
import { Activo } from '@app/Entities/activo.entity';
import { User } from '@app/Entities/user.entity';
import { Ubicacion } from '@app/Entities/ubicacion.entity';
import { AuthModule } from '@app/auth/auth.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Prestamo, Activo, User, Ubicacion]),
    forwardRef(() => AuthModule), // Usa forwardRef para evitar dependencias circulares
  ],
  controllers: [PrestamoController],
  providers: [PrestamoService],
})
export class PrestamoModule {}