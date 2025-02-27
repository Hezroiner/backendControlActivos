import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@app/user/user.service';
import * as bcrypt from 'bcryptjs';
import { User } from '@app/Entities/user.entity';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { EncoderService } from './encoder.service';


@Injectable()
export class AuthService {
  
  
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private encoderService: EncoderService
  ) {}

  async validateUser(email: string, contraseña: string): Promise<User | null> {
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(contraseña, user.contraseña);
    if (!isPasswordValid) {
      return null;
    }

    return user;  
  }

  // Método para validar el reCAPTCHA
  async validateRecaptcha(recaptchaToken: string): Promise<void> {
    const secretKey = this.configService.get<string>('RECAPTCHA_SECRET_KEY');  // Obtener la secretKey desde el archivo .env
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;

    try {
      const { data } = await axios.post(url);
      if (!data.success) {
        throw new BadRequestException('Falló la validación de reCAPTCHA');
      }
    } catch (error) {
      throw new BadRequestException('Error validando reCAPTCHA');
    }
  }

  // Método de login con la validación de reCAPTCHA
  async login(user: User, recaptchaToken: string) {
    // Validar el token de reCAPTCHA antes de continuar con el login
    await this.validateRecaptcha(recaptchaToken);

    const payload = {
      email: user.email,
      sub: user.id,
      role: user.rol.nombre,
      ubicaciones: user.ubicaciones.map((ubicacion) => ({ id: ubicacion.id, nombre: ubicacion.nombre })),
      nombre: user.nombre,  // Incluye el nombre del usuario
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

}