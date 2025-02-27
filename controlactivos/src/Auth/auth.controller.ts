import { Controller, Post, Body, UnauthorizedException, UseGuards, Patch } from '@nestjs/common';
import { AuthService } from './AuthService';
import { LoginDTO } from './dto/LoginDTO';
import { JwtAuthGuard } from 'src/Auth/JwtAuthGuard';
import { GetUser } from './get-user.decorator';
import { User } from '@app/Entities/user.entity';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDTO) {
    const { email, contraseña, recaptchaToken } = loginDto;  // Extraer recaptchaToken desde loginDto

    const user = await this.authService.validateUser(email, contraseña);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    // Pasar recaptchaToken al AuthService
    return this.authService.login(user, recaptchaToken);
  }
}
