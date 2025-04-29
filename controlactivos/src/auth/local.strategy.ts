import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import * as bcrypt from 'bcryptjs';
import { UserService } from '@app/user/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private userService: UserService) {
    // Definimos tanto el campo de usuario como el de contraseña
    super({
      usernameField: 'email',
      passwordField: 'contraseña',
    });
  }

  async validate(email: string, contraseña: string): Promise<any> {
    // 1. Buscamos al usuario por email (incluye rol y ubicaciones)
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 2. Verificamos la disponibilidad
    if (user.disponibilidad === 'Fuera de Servicio') {
      throw new UnauthorizedException('Usuario fuera de servicio');
    }

    // 3. Comparamos la contraseña
    const isPasswordValid = await bcrypt.compare(contraseña, user.contraseña);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 4. Removemos la contraseña del objeto antes de devolverlo
    //    para que no viaje en el JWT ni en el request.user
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { contraseña: _, ...result } = user;
    return result;
  }
}
