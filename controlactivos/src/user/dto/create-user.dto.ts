export class CreateUserDTO {
    nombre: string;
    apellido_1: string;
    apellido_2: string;
    email: string;
    contraseña: string;
    disponibilidad?: string;
    
    rolId : number;
    ubicacionIds? : number[]
}