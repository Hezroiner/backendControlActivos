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
import { EncoderService } from './encoder.service';


@Injectable()
export class AuthService {
  
  
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
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
    const user = await this.userService.findOneByTokenRestablecerAcceso(
      tokenRestablecerAcceso,
    );

    if (!user) {
      throw new BadRequestException('Invalid or expired reset password token');
    }else if(!contraseña){
      throw new BadRequestException('Password is required');
    }


    user.contraseña = await bcrypt.hash(contraseña, 10);
    user.tokenRestablecerAcceso = null;

    await this.userService.updateUser(user.id, user);

    return { message: 'Password reset successfully' };
  }


  async changePassword(changePasswordDto: ChangePasswordDto, user: User): Promise<void>{
    const {oldPassword, newPassword} = changePasswordDto;
    if (await this.encoderService.checkPassword(oldPassword, user.contraseña)) {
      user.contraseña = await this.encoderService.encodePassword(newPassword);
      this.userService.updateUser(user.id, user);
    } else {
      throw new BadRequestException('Old password does not match');
    }
  }
}