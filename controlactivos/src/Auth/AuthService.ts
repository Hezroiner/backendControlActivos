import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { User } from '../Entities/user.entity';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '../mailer/mailer.service';
import { resetPasswordEmailTemplate } from 'src/mailer/templates/resetPasswordEmail';
import { ChangePasswordDto } from './dto/change-password.dto';



@Injectable()
export class AuthService {
  
  
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
    
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
  //Método recuperar contraseña 
  async forgotPassword(email: string) {
    const user = await this.userService.findOneByEmail(email);

    const passwordResetToken = await this.jwtService.signAsync(
      { userId: user.id },
      { expiresIn: '1h' },
    );

    user.tokenRestablecerAcceso = passwordResetToken;
    await this.userService.updateUser(user.id, user);

    const html = resetPasswordEmailTemplate(user.nombre, passwordResetToken);

    await this.mailerService.sendEmail({
      to: [{ name: user.nombre, address: user.email }],
      subject: 'Reset your password',
      html,
    });

    return { message: 'Password reset instructions sent to your email' };
  }

async resetPassword(tokenRestablecerAcceso: string, contraseña: string) {
  
  //  Verifica que el token es válido y no ha expirado
  let payload;
  try {
      payload = await this.jwtService.verifyAsync(tokenRestablecerAcceso);
  } catch (error) {
      throw new BadRequestException('Invalid or expired reset password token');
  }

  //  Busca al usuario basado en el `userId` del payload del token
  const user = await this.userService.getUser(payload.userId);
  if (!user || user.tokenRestablecerAcceso !== tokenRestablecerAcceso) {
      throw new BadRequestException('Invalid or expired reset password token');
  }

  //  Verificar si la nueva contraseña fue proporcionada
  if (!contraseña) {
      throw new BadRequestException('Password is required');
  }

  //  Actualiza la contraseña y eliminar el token de restablecimiento
  user.contraseña = await bcrypt.hash(contraseña, 10);
  user.tokenRestablecerAcceso = null;
  
  await this.userService.updateUser(user.id, user);

  return { message: 'Password reset successfully' };
}
// const user = await this.userService.findOneByTokenRestablecerAcceso(
  //     tokenRestablecerAcceso,
  //   );

  //   if (!user) {
  //     throw new BadRequestException('Invalid or expired reset password token');
  //   }else if(!contraseña){
  //     throw new BadRequestException('Password is required');
  //   }

  //   user.contraseña = await bcrypt.hash(contraseña, 10);
  //   user.tokenRestablecerAcceso = null;

  //   await this.userService.updateUser(user.id, user);

  //   return { message: 'Password reset successfully' };
  // }

//Método cambiar contraseña en el perfil de usuario

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {
    const { oldPassword, newPassword } = changePasswordDto;
    
    const user = await this.userService.getUser(userId);
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }
  
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.contraseña);
    if (!isOldPasswordValid) {
      throw new BadRequestException('La contraseña actual es incorrecta');
    }
  
    user.contraseña = await bcrypt.hash(newPassword, 10);
    await this.userService.updateUser(user.id, user);
    return { message: 'La contraseña se ha cambiado correctamente' };
  }
}