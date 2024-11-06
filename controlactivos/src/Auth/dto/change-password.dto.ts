import { IsNotEmpty,Length, Matches } from "class-validator";

export class ChangePasswordDto {
@IsNotEmpty()
@Length(6, 20)
oldPassword: string;

@IsNotEmpty()
@Length(8, 20)
@Matches(/^(?=.*[A-Z])(?=.*[!@#$&*\.])(?=.*[0-9])(?=.*[a-z]).{8,}$/, {
    message:
      'La nueva contraseña debe tener al menos una letra mayúscula, un carácter especial, un número y una longitud mínima de 8 caracteres',
  })
newPassword: string;

}