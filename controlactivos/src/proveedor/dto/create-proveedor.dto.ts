import { IsEmail } from "class-validator";

export class CreateProveedorDTO {
    vendedor: string;
    nombreEmpresa: string;
    telefonoProveedor: string;
    disponibilidad?: string;
    telefonoEmpresa: string;

    @IsEmail({}, {message: 'El email ingresado no es válido.'})
    email: string;
}