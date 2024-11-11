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
import { AuthModule } from './auth/auth.module';  
import { ConfigModule } from '@nestjs/config';
import { PrestamoModule } from './prestamo/prestamo.module';
//mysql://root:NYRELvMsHdSXWVXBrLwDsHLMwVkyNpXi@autorack.proxy.rlwy.net:42891/railway

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'autorack.proxy.rlwy.net',
      port: 42891,
      username: 'root',
      password: 'NYRELvMsHdSXWVXBrLwDsHLMwVkyNpXi',
      database: 'controlactivos',
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
