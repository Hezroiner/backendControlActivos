import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { LicitacionModule } from './licitacion/licitacion.module';
import { LeyModule } from './ley/ley.module';
import { ProveedorModule } from './proveedor/proveedor.module';
import { UbicacionModule } from './ubicacion/ubicacion.module';
import { DonadorModule } from './donador/donador.module';
import { RolModule } from './rol/rol.module';
import { ActivoModule } from './activo/activo.module';
import { LicenciaModule } from './licencia/licencia.module';
import { ConfigModule } from '@nestjs/config';
import { PrestamoModule } from './prestamo/prestamo.module';
import { InventarioModule } from './inventario/inventario.module';
import { AuthModule } from './auth/auth.module';

//mysql://root:MPkVLPBCKfSHBLJfbzuGzZTGoRISfkcI@shortline.proxy.rlwy.net:28675/controlactivos

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),  // Configura el ConfigModule como global
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UserModule,
    LicitacionModule,
    LeyModule,
    ProveedorModule,
    UbicacionModule,
    DonadorModule,
    RolModule,
    ActivoModule,
    LicenciaModule,
    AuthModule,
    PrestamoModule, 
    InventarioModule,     
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
