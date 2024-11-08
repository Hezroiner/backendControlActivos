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
import { PrestamoModule } from './Prestamo/prestamo.module';
import { MailerModule as MaileModule } from './mailer/mailer.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { NodemailerConfig } from './config/nodemailer.config';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),  // Configura el ConfigModule como global
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'controlactivos',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    MailerModule.forRootAsync({
      useClass: NodemailerConfig,
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
    MaileModule,
    
      
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
