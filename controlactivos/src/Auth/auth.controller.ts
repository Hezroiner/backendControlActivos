import { Controller, Post, Body, UnauthorizedException, UseGuards, Patch } from '@nestjs/common';
import { AuthService } from './AuthService';
import { LoginDTO } from './dto/LoginDTO';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from 'src/Auth/JwtAuthGuard';
import { GetUser } from './get-user.decorator';
import { User } from 'src/Entities/user.entity';


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
   //Recuperar contraseña
  @Post('forgot-password')
  forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  resetPassword(
    @Body('tokenRestablecerAcceso') tokenRestablecerAcceso: string,
    @Body('contraseña') contraseña: string,
  ) {
    return this.authService.resetPassword(tokenRestablecerAcceso, contraseña);
  }

  @Patch("change-pasaword")
  @UseGuards(JwtAuthGuard)
  changePassword(
  @Body() changePasswordDto: ChangePasswordDto,
  @GetUser() user: User
): Promise<void> {
  return this.authService.changePassword(changePasswordDto, user);
}
}
