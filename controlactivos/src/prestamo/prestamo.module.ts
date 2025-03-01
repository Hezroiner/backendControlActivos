import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prestamo } from '../Entities/prestamo.entity';
import { PrestamoController } from './prestamo.controller';
import { PrestamoService } from './prestamo.service';
import { Activo } from '../Entities/activo.entity';
import { User } from '../Entities/user.entity';
import { Ubicacion } from '../Entities/ubicacion.entity';
import { AuthModule } from '../auth/auth.module'; // Importar el AuthModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Prestamo, Activo, User, Ubicacion]),
    forwardRef(() => AuthModule), // Usa forwardRef para evitar dependencias circulares
  ],
  controllers: [PrestamoController],
  providers: [PrestamoService],
})
export class PrestamoModule {}