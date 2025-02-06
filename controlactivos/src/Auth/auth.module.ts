// src/auth/auth.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';  // Importación correcta del UserModule
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './AuthService';
import { LocalStrategy } from './local.strategy';
import { RolesGuard } from './roles.guard';
import { EncoderService } from './encoder.service';


@Module({
  imports: [
    forwardRef(() => UserModule),  // Usa forwardRef para romper la dependencia circular
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),  // Usa la clave secreta del archivo .env
        signOptions: { expiresIn: '1h' }, // El token expira en 1 hora
      }),
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RolesGuard,
    EncoderService,
  ],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],  // Exporta lo necesario para otros módulos
})
export class AuthModule {}
