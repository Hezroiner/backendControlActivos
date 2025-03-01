import { Controller, Post, Body, UnauthorizedException, UseGuards, Patch, Req } from '@nestjs/common';
import { AuthService } from './AuthService';
import { LoginDTO } from './dto/LoginDTO';
import { JwtAuthGuard } from 'src/Auth/JwtAuthGuard';
import { User } from 'src/Entities/user.entity';
import { ChangePasswordDto } from './dto/change-password.dto';


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