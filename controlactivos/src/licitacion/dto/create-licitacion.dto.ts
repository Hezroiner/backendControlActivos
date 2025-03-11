import { Moneda } from "@app/Entities/licitacion.entity";

export class CreateLicitacionDTO {
    numActa: string;
    numLicitacion: number;
    nombre: string;
    monto: number;
    moneda: Moneda;
    descripcion: string;
    disponibilidad?: string;
    fecha: Date;
    idProveedor: number;
    idLey:number;
}