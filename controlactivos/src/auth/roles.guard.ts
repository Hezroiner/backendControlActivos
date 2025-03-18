import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;  // Si no hay roles requeridos, permitir acceso
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return false;
    }

    const token = authHeader.split(' ')[1];

    try {
      const payload = this.jwtService.verify(token);  // Verificamos el token y obtenemos el payload
      return requiredRoles.some((role) => payload.role === role);  // Comprobar si el usuario tiene el rol requerido
    } catch (error) {
      return false;  // Si hay un error en la verificación del token, denegamos acceso
    }
  }
}
