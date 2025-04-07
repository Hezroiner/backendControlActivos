import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from './AuthService';
import { Strategy } from 'passport-local';  // Importa passport-local

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });  // Definir el campo email como el usuario
  }

  async validate(email: string, contraseña: string): Promise<any> {
    const user = await this.authService.validateUser(email, contraseña);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return user;
  }
}
