import { Controller, Post, Body, UnauthorizedException, UseGuards, Patch, Req } from '@nestjs/common';
import { LoginDTO } from './dto/LoginDTO';
import { AuthService } from './AuthService';
import { LocalAuthGuard } from './local-auth.guard';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
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