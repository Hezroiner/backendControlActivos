export class UpdateUserDTO {

    nombre?: string;
    descripcion?: string;
    apellido_1?: string;
    apellido_2?: string;
    email?: string;
    contraseña?: string;
    disponibilidad?: string;
    
    rolId?: number;
    ubicacionIds? : number[]
}